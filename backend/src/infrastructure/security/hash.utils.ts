import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

export class HashUtils {
  private static configService: ConfigService;
  private static salt: string | number;

  constructor(configService: ConfigService) {
    HashUtils.configService = configService;
    HashUtils.salt = HashUtils.configService.get<number>('salt') || 12;
  }

  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, Number(HashUtils.salt));
  }

  static async verifyPassword(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashPassword);
  }
}
