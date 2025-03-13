import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createCorsConfig } from './infrastructure/web/cors';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { validationPipeOptions } from './infrastructure/web/validation-pipe';
import { GlobalExceptionHandler } from './infrastructure/web/global-exception-handler';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // App configurations
  app.setGlobalPrefix('api/v1/');
  app.use(cookieParser);
  app.enableCors(createCorsConfig(configService));
  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));
  app.useGlobalFilters(new GlobalExceptionHandler());
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  await app.listen(3000);
}
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
bootstrap()
  .then((): void => console.log('Server running on port 3000'))
  .catch((err): void => console.log(err));
