import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createTypeOrmConfig } from './infrastructure/database/typeorm.config';
import { MongooseModule } from '@nestjs/mongoose';
import { createMongooseConfig } from './infrastructure/database/mongoos.config';
import { AuthController } from './api/controller/auth.controller';
import { AuthService } from './application/service/auth.service';
import { UserEntity } from './domain/entity/user.entity';
import { ThrottlerModule } from '@nestjs/throttler';
import { createThrottler } from './infrastructure/web/throttler.config';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './infrastructure/security/jwt/token.service';
import { UserController } from './api/controller/user.controller';
import { UserService } from './application/service/user.service';
import { GroupEntity } from './domain/entity/group.entity';
import { GroupService } from './application/service/group.service';
import { GroupController } from './api/controller/group.controller';
import { JwtStrategy } from './infrastructure/security/jwt/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { RelationsController } from './api/controller/relations.controller';
import { RelationsService } from './application/service/relations.service';
import { FriendRequestEntity } from './domain/entity/friend-request.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { FriendRequestListener } from './application/event/friend-request.listener';
import { NotificationEntity } from './domain/entity/notification.entity';
import { NotificationGateway } from './api/gateway/notification.gateway';
import { NotificationService } from './application/service/notification.service';
import { NotificationController } from './api/controller/notification.controller';
import { ChatController } from './api/controller/chat.controller';
import { ChatService } from './application/service/chat.service';
import { Message, MessageSchema } from './domain/entity/message.schema';
import { ChatGateway } from './api/gateway/messages.gateway';

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
    TypeOrmModule.forFeature([
      UserEntity,
      GroupEntity,
      FriendRequestEntity,
      NotificationEntity,
    ]),
    // MongoDb configurations
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createMongooseConfig,
    }),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    // Throttler
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createThrottler,
    }),
    EventEmitterModule.forRoot(),
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
  controllers: [
    NotificationController,
    AuthController,
    UserController,
    GroupController,
    RelationsController,
    ChatController,
  ],
  providers: [
    NotificationService,
    NotificationGateway,
    FriendRequestListener,
    RelationsService,
    GroupService,
    UserService,
    ChatService,
    AuthService,
    TokenService,
    JwtStrategy,
    ChatGateway,
  ],
})
export class AppModule {}
