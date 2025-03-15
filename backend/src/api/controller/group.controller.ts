import { Controller, UseGuards } from '@nestjs/common';
import { MixinsCrudController, ResponseDto } from 'nestjs-crud-mixins';
import { GroupService } from '../../application/service/group.service';
import { GroupEntity } from '../../domain/entity/group.entity';
import { GroupDto } from '../../application/dto/response/group.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@ResponseDto(GroupDto)
@Controller('groups')
export class GroupController extends MixinsCrudController<
  GroupEntity,
  GroupService
> {
  constructor(private readonly groupService: GroupService) {
    super(groupService, new GroupEntity());
  }
}
