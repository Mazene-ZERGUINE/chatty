import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  CreateDto,
  MixinsCrudController,
  ResponseDto,
} from 'nestjs-crud-mixins';
import { FriendRequestEntity } from '../../domain/entity/friend-request.entity';
import { RelationsService } from '../../application/service/relations.service';
import {
  CreateFriendRequestDto,
  FriendRequestDetailsDto,
  FriendRequestDto,
} from '../../application/dto/request/friend-request.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@ResponseDto(FriendRequestDetailsDto)
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
  @ResponseDto(FriendRequestDto)
  async create(
    @Body() createDto: InstanceType<ReturnType<this['getCreateDto']>>,
  ): Promise<FriendRequestDto> {
    return this.relationsService.registerFriendRequest(createDto);
  }

  @Get(':id/validate')
  @HttpCode(HttpStatus.OK)
  async validateFriendRequest(
    @Param('id') id: number,
    @Query() action: { accpet: boolean },
  ): Promise<boolean> {
    return await this.relationsService.handelFriendRequest(id, action.accpet);
  }
}
