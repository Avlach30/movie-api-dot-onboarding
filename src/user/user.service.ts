import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(name: string, email: string, password: string) {
    //* Validation fo required
    if (!name || !email || !password) {
      throw new BadRequestException('Please input all fields');
    }

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
    });

    await this.userRepository.save(newUser);

    return {
      message: 'Sign up successfully',
      email: email,
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
      },
      {
        expiresIn: '4h',
        secret: this.configService.get<string>('JWT_SECRET'),
      },
    );

    return {
      message: 'Login successfully',
      userId: user.id,
      token: token,
    };
  }
}
