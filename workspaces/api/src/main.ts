import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    exceptionFactory: (errors) => {
      return new BadRequestException({
        message: "Your request parameters didn't validate.",
        fields: errors.reduce(
          (acc, e) => ({
            ...acc,
            [e.property]: Object.values(e.constraints).pop(),
          }),
          {},
        ),
      });
    },
  }));
  await app.listen(3000);
}
bootstrap();
