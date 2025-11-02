import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor, setDefaultLanguage } from './common';
import * as express from 'express';
import path from 'path';

async function bootstrap() {
  const port = process.env.PORT ?? 3000;
  const app = await NestFactory.create(AppModule);
  app.use(setDefaultLanguage);
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.use('/uploads', express.static(path.resolve('./uploads')));
  await app.listen(port, () => {
    console.log(`Server is Running On Port ::: ${port} !!!`);
  });
}
bootstrap();
