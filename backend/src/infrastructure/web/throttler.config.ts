import { ThrottlerModuleOptions } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';

export const createThrottler = (
  configService: ConfigService,
): ThrottlerModuleOptions => {
  return {
    throttlers: [
      {
        ttl: configService.get<number>('THROTTLE_TTL', 60),
        limit: configService.get<number>('THROTTLE_LIMIT', 5),
      },
    ],
  };
};
