import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './token-payload.interface';
import { Response } from 'express';

@Injectable()
export class TokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  createAccessToken(payload: TokenPayload): string {
    return this.jwtService.sign(
      { userId: payload.userId, email: payload.email },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_ACCESS_EXPIRES_IN',
          '30m',
        ),
      },
    );
  }

  createRefreshToken(payload: TokenPayload): string {
    return this.jwtService.sign(
      { userId: payload.userId },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_EXPIRES_IN',
          '7d',
        ),
      },
    );
  }

  setTokenCookies(
    response: Response,
    accessToken: string,
    refreshToken: string,
  ): void {
    response.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
    });

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
    });
  }

  clearTokenCookies(response: Response): void {
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');
  }

  verifyAccessToken(token: string): unknown {
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  verifyRefreshToken(token: string): { userId: number; email: string } {
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
  }
}
