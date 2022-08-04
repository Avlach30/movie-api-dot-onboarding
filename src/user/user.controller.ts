import { Body, Controller, HttpCode, Post } from '@nestjs/common';

import { UserService } from './user.service';
import { SignupDto } from '../dto/signUp.dto';

@Controller('api/auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @HttpCode(201)
  async signUp(@Body() dto: SignupDto, @Body('password') password: string) {
    return await this.userService.signUp(dto.name, dto.email, password);
  }

  @Post('login')
  @HttpCode(201)
  async logIn(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return await this.userService.login(email, password);
  }
}
