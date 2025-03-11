import { ConfigService } from '@nestjs/config';
import { MongooseModuleFactoryOptions } from '@nestjs/mongoose';

export const createMongooseConfig = (
  configService: ConfigService,
): MongooseModuleFactoryOptions => {
  return {
    uri: configService.get<string>('MONGODB_URI'),
    dbName: configService.get<string>('MONGODB_DATABASE', 'chatty_db'),
    retryAttempts: 5,
    retryDelay: 3000,
    autoCreate: true,
    connectionFactory: (connection): void => {
      console.log('MongoDB Connected:', connection.name);
      return connection;
    },
  };
};
