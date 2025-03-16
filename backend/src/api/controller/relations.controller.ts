import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  CreateDto,
  MixinsCrudController,
  ResponseDto,
} from 'nestjs-crud-mixins';
import { FriendRequestEntity } from '../../domain/entity/friend-request.entity';
import { RelationsService } from '../../application/service/relations.service';
import {
  CreateFriendRequestDto,
  FriendRequestDto,
} from '../../application/dto/request/friend-request.dto';

@ResponseDto(FriendRequestDto)
@CreateDto(CreateFriendRequestDto)
@Controller('relations')
export class RelationsController extends MixinsCrudController<
  FriendRequestEntity,
  RelationsService
> {
  constructor(private readonly relationsService: RelationsService) {
    super(relationsService, new FriendRequestEntity());
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDto: InstanceType<ReturnType<this['getCreateDto']>>,
  ): Promise<FriendRequestDto> {
    return this.relationsService.registerFriendRequest(createDto);
  }
}
