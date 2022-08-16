import { extname } from 'path';

import { BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

export const UploadHandler = (field: string, dir: string) => {
  return FileInterceptor(field, {
    storage: diskStorage({
      destination: `./assets/${dir}`,
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
  });
};
