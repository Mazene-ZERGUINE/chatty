import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createTypeOrmConfig } from './infrastructure/database/typeorm.config';
import { MongooseModule } from '@nestjs/mongoose';
import { createMongooseConfig } from './infrastructure/database/mongoos.config';
import { AuthController } from './api/controller/auth.controller';
import { AuthService } from './application/service/auth.service';
import { UserEntity } from './domain/entity/user.entity';

@Module({
  imports: [
    // Config Module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // TypeORM configurations
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createTypeOrmConfig,
    }),
    TypeOrmModule.forFeature([UserEntity]),
    // MongoDb configurations
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createMongooseConfig,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
