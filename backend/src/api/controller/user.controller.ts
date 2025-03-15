import { Controller, UseGuards } from '@nestjs/common';
import { MixinsCrudController, ResponseDto } from 'nestjs-crud-mixins';
import { UserEntity } from '../../domain/entity/user.entity';
import { UserService } from '../../application/service/user.service';
import { UserDto } from '../../application/dto/response/user.dto';
import { AuthGuard } from '@nestjs/passport';

@ResponseDto(UserDto)
@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UserController extends MixinsCrudController<
  UserEntity,
  UserService
> {
  constructor(private readonly userService: UserService) {
    super(userService, new UserEntity());
  }
}
