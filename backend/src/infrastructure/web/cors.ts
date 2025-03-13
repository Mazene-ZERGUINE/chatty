import { ConfigService } from '@nestjs/config';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const createCorsConfig = (
  configService: ConfigService,
): CorsOptions => ({
  origin: configService.get<string>(
    'ALLOWED_ORIGIN_URL',
    'http://localhost:4200',
  ),
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
});
