import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationController } from './modules/auth/auth.controller';
import { AuthenticationService } from './modules/auth/auth.service';
import { AuthenticationModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolve("./config/.env.dev"),
      isGlobal: true
    }),
    AuthenticationModule,
    MongooseModule.forRoot(process.env.DB_URI as string, { serverSelectionTimeoutMS: 30000 }),
    UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
