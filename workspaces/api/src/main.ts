import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { globalPipes } from './main.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(globalPipes);
  await app.listen(3000);
}
bootstrap();
