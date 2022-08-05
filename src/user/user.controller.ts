import { extname } from 'path';

import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { UserService } from './user.service';
import { SignupDto } from '../dto/signUp.dto';

@Controller('api/v1/auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './assets/avatar',
        filename(req, file, callback) {
          const fileExtName = extname(file.originalname);
          const newName = Date.now();
          callback(null, `image-${newName}${fileExtName}`);
        },
      }),
      fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg)$/)) {
          return callback(
            new BadRequestException(
              'Sorry, only image files (jpg/jpeg) are allowed!',
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  @HttpCode(201)
  async signUp(@Body() dto: SignupDto, @UploadedFile() file) {
    return await this.userService.signUp(
      dto.name,
      dto.email,
      dto.password,
      file,
    );
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
