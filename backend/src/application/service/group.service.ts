import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupEntity } from '../../domain/entity/group.entity';
import { Repository } from 'typeorm';
import { MixinsCrudService } from 'nestjs-crud-mixins';

@Injectable()
export class GroupService extends MixinsCrudService<GroupEntity> {
  constructor(
    @InjectRepository(GroupEntity)
    private readonly groupRepository: Repository<GroupEntity>,
  ) {
    super(groupRepository, new GroupEntity());
  }
}
