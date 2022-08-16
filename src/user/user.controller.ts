import {
  Body,
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';

import { UserService } from './user.service';
import { SignupDto } from '../dto/sign-up.dto';
import { ResponseInterceptor } from 'src/utils/responses/api-success-response';
import { HttpExceptionFilter } from 'src/utils/responses/api-failed-response';
import { UploadHandler } from 'src/utils/image-upload';

@Controller('api/v1/auth')
@UseInterceptors(ResponseInterceptor)
@UseFilters(new HttpExceptionFilter())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @UseInterceptors(UploadHandler('avatar', 'avatar'))
  @HttpCode(201)
  async signUpCustomer(@Body() dto: SignupDto, @UploadedFile() file) {
    return await this.userService.signUp(
      dto.name,
      dto.email,
      dto.password,
      file,
      false,
      'Sign up for customer successfully',
    );
  }

  @Post('/admin/signup')
  @UseInterceptors(UploadHandler('avatar', 'avatar-admin'))
  @HttpCode(201)
  async signUpAdmin(@Body() dto: SignupDto, @UploadedFile() file) {
    return await this.userService.signUp(
      dto.name,
      dto.email,
      dto.password,
      file,
      true,
      'Sign up for admin successfully',
    );
  }

  @Post('login')
  @HttpCode(200)
  async logIn(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return await this.userService.login(email, password);
  }
}
