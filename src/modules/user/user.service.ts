import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { User } from '../../entities/user.entity';
import { generateDateNow } from '../../utils/date-now';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
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

    //* Check if user already exist based on email
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
    if (user) {
      throw new BadRequestException('E-Mail already exist');
    }

    const hashedPw = await bcrypt.hash(password, 12);

    const newUser = await this.userRepository.create({
      name: name,
      email: email,
      password: hashedPw,
      avatar: avatar,
      is_admin: isAdmin,
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

    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
    if (!user) throw new BadRequestException('User not found with this email');

    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) throw new BadRequestException('Password Incorrect');

    const token = this.jwtService.sign(
      {
        userId: user.id,
        isUserAdmin: user.is_admin,
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
}
