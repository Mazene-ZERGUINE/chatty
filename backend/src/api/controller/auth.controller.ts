import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../../application/service/auth.service';
import { UserCreateDto } from '../../application/dto/request/user-create.dto';
import { LoginDto } from '../../application/dto/request/login.dto';
import { Request, Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { UserEntity } from '../../domain/entity/user.entity';
import { ResponseDto } from 'nestjs-crud-mixins';
import { UserDto } from '../../application/dto/response/user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 3, ttl: 60 } })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() user: UserCreateDto): Promise<void> {
    await this.authService.register(user);
  }

  //@Throttle({ default: { limit: 3, ttl: 60 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res() response: Response,
  ): Promise<void> {
    await this.authService.login(loginDto, response);
    response.status(HttpStatus.OK).send();
  }

  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Res() response: Response,
    @Req() request: Request,
  ): Promise<void> {
    await this.authService.refreshToken(request, response);
    response.status(HttpStatus.OK).send();
  }

  @Get('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res() response: Response): Promise<void> {
    await this.authService.logout(response);
  }

  @UseGuards(AuthGuard('jwt'))
  @ResponseDto(UserDto)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getUserData(@Req() request: Request): Promise<UserEntity> {
    const token = request.cookies['access_token'];
    return this.authService.getUserData(token);
  }
}
