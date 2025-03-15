import { Injectable } from '@nestjs/common';
import { MixinsCrudService } from 'nestjs-crud-mixins';
import { UserEntity } from '../../domain/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService extends MixinsCrudService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super(userRepository, new UserEntity());
  }
}
