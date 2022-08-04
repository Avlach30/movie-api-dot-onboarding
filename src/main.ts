import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);

  const port: number = configService.get<number>('PORT');

  await app.listen(port, () => {
    console.log('Database connected!');
    console.log(`Server running on http://localhost:${port}`);
  });
}
bootstrap();
