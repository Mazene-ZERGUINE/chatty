import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../../application/service/auth.service';
import { UserCreateDto } from '../../application/dto/request/user-create.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() user: UserCreateDto): Promise<void> {
    await this.authService.register(user);
  }
}
