import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserService } from './user.service';
import { SignupDto } from '../../dto/sign-up.dto';
import { ResponseInterceptor } from 'src/utils/responses/api-success-response';
import { HttpExceptionFilter } from 'src/utils/responses/api-failed-response';
import { UploadHandler } from 'src/utils/image-upload';
import { SentryInterceptor } from 'src/utils/sentry.interceptor';

@Controller('api/v1/auth')
@UseInterceptors(ResponseInterceptor, SentryInterceptor)
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

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  @HttpCode(200)
  async getLoggedUser(@Req() req: any) {
    return await this.userService.getLoggedUser(req, 'loggedUserId');
  }
}
