import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { User } from '../../entities/user.entity';
import { generateDateNow } from '../../utils/date-now';
import KeycloakAdminClient from '@keycloak/keycloak-admin-client';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(
    name: string,
    email: string,
    password: string,
    file: any,
    isAdmin: boolean,
    message: string,
  ) {
    // eslint-disable-next-line prettier/prettier
    const avatar = `http://localhost:${this.configService.get<number>('port')}/assets${file.path.replace(/\\/g, '/').substring('public'.length)}`;

    //* Configure keycloak
    const keycloackAdminClient = new KeycloakAdminClient();
    await keycloackAdminClient.auth({
      username: 'admin',
      password: 'adminPassword',
      grantType: 'password',
      clientId: 'admin-cli',
    });

    keycloackAdminClient.setConfig({
      realmName: 'movie-realm',
    });

    //* Check if user already exist based on email from db and keycloak
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });

    const existingKeycloackUser = await keycloackAdminClient.users.find({
      email: email,
    });

    if (user || existingKeycloackUser[0] != undefined) {
      throw new BadRequestException('E-Mail already exist');
    }

    const hashedPw = await bcrypt.hash(password, 12);

    //* Insert new data to keycloak
    await keycloackAdminClient.users.create({
      username: name,
      email: email,
      firstName: 'user',
      lastName: name,
      credentials: [
        {
          type: 'password',
          value: hashedPw,
          temporary: false,
        },
      ],
    });

    //* Insert new data to db via ORM
    const newUser = await this.userRepository.create({
      name: name,
      email: email,
      password: hashedPw,
      avatar: avatar,
      isAdmin: isAdmin,
      created_at: generateDateNow(),
      updated_at: generateDateNow(),
    });

    await this.userRepository.save(newUser);

    return {
      data: newUser,
      message: message,
    };
  }

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new BadRequestException('Please input all fields');
    }

    //* Configure keycloak
    const keycloackAdminClient = new KeycloakAdminClient();
    await keycloackAdminClient.auth({
      username: 'admin',
      password: 'adminPassword',
      grantType: 'password',
      clientId: 'admin-cli',
    });

    keycloackAdminClient.setConfig({
      realmName: 'movie-realm',
    });

    //* Check user data in DB and keycloak directory
    const existingKeycloackUser = await keycloackAdminClient.users.find({
      email: email,
    });
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });

    if (!user || !existingKeycloackUser[0]) {
      throw new BadRequestException('User not found with this email');
    }

    // console.log(existingKeycloackUser);

    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) throw new BadRequestException('Password Incorrect');

    const token = this.jwtService.sign(
      {
        userId: user.id,
        isUserAdmin: user.isAdmin,
        keycloak: {
          userId: existingKeycloackUser[0].id,
          totp: existingKeycloackUser[0].totp,
          accessConfig: existingKeycloackUser[0].access,
        },
      },
      {
        expiresIn: '4h',
        secret: this.configService.get<string>('JWT_SECRET'),
      },
    );

    return {
      data: {
        _token: token,
        userId: user.id,
      },
      message: 'Successfully log in',
    };
  }

  async getLoggedUser(req: any, key: string) {
    let userId;

    const getUserId = await this.cacheManager.get(key); //* Get key from redis store
    // console.log(getUserId);
    //If loggedUserId not exist
    if (!getUserId) {
      //* Set key with value and save it to redis store
      await this.cacheManager.set(key, req.user.userId);
      userId = await this.cacheManager.get(key);
    } else {
      userId = getUserId;
    }

    const user = await this.userRepository.findByIds([userId]);

    return {
      data: user,
      message: 'Successfully get logged user',
    };
  }
}
