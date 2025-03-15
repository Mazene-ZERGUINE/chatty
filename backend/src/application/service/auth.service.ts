import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../domain/entity/user.entity';
import { Repository } from 'typeorm';
import { UserCreateDto } from '../dto/request/user-create.dto';
import { HashUtils } from '../../infrastructure/security/hash.utils';
import { ConfigService } from '@nestjs/config';
import { PhoneNumber } from '../../domain/vo/phone-number';
import { LoginDto } from '../dto/request/login.dto';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '../../infrastructure/security/jwt/token.service';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {
    new HashUtils(this.configService);
  }

  async register(user: UserCreateDto): Promise<void> {
    const isExistingUser = await this.checkUserExists(user);
    if (isExistingUser) {
      throw new ConflictException('User already exists');
    }
    const phoneNumber: string = PhoneNumber.create(
      user.countryCode,
      user.phoneNumber,
    ).toPhoneNumber();
    const hashedPassword = await HashUtils.hashPassword(user.password);

    const newUser = { ...user, phoneNumber, password: hashedPassword };
    await this.usersRepository.save(newUser);
  }

  async login(loginDto: LoginDto, response: Response): Promise<void> {
    const user = await this.usersRepository.findOneBy({
      email: loginDto.email,
    });
    if (
      !user ||
      !(await HashUtils.verifyPassword(loginDto.password, user.password))
    ) {
      throw new NotFoundException('Account not found');
    }

    const accessToken = this.tokenService.createAccessToken({
      userId: user.id,
      email: user.email,
    });

    const refreshToken = this.tokenService.createRefreshToken({
      userId: user.id,
    });

    this.tokenService.setTokenCookies(response, accessToken, refreshToken);
  }

  async refreshToken(request: Request, response: Response): Promise<void> {
    const refreshToken = request.cookies.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      const payload = this.tokenService.verifyRefreshToken(refreshToken);
      const user = await this.usersRepository.findOneBy({ id: payload.userId });

      if (!user) {
        throw new ForbiddenException('Invalid refresh token');
      }

      const newAccessToken = this.tokenService.createAccessToken({
        userId: user.id,
        email: user.email,
      });

      response.cookie('access_token', newAccessToken, {
        httpOnly: true,
        sameSite: 'strict',
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token', error);
    }
  }

  async getUserData(token: string): Promise<UserEntity> {
    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }
    const decodedToken = this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
    });
    return this.userService.findEntity(decodedToken.userId);
  }

  async logout(response: Response): Promise<void> {
    this.tokenService.clearTokenCookies(response);
  }

  private async checkUserExists(user: UserCreateDto): Promise<boolean> {
    return (
      (await this.usersRepository.findOneBy({ email: user.email })) !== null
    );
  }
}
