import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createTypeOrmConfig } from './infrastructure/database/typeorm.config';
import { MongooseModule } from '@nestjs/mongoose';
import { createMongooseConfig } from './infrastructure/database/mongoos.config';
import { AuthController } from './api/controller/auth.controller';
import { AuthService } from './application/service/auth.service';
import { UserEntity } from './domain/entity/user.entity';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { createThrottler } from './infrastructure/web/throttler.config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { TokenService } from './infrastructure/security/jwt/token.service';
import { UserController } from './api/controller/user.controller';
import { UserService } from './application/service/user.service';
import { GroupEntity } from './domain/entity/group.entity';
import { GroupService } from './application/service/group.service';
import { GroupController } from './api/controller/group.controller';
import { JwtStrategy } from './infrastructure/security/jwt/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

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
    TypeOrmModule.forFeature([UserEntity, GroupEntity]),
    // MongoDb configurations
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createMongooseConfig,
    }),
    // Throttler
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createThrottler,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<{ signOptions: { expiresIn: string }; secret: string }> => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController, UserController, GroupController],
  providers: [
    GroupService,
    UserService,
    AuthService,
    TokenService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
