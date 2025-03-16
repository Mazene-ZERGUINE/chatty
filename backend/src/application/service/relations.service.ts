import { Injectable, NotFoundException } from '@nestjs/common';
import { MixinsCrudService } from 'nestjs-crud-mixins';
import { FriendRequestEntity } from '../../domain/entity/friend-request.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendRequestDto } from '../dto/request/friend-request.dto';
import { UserEntity } from '../../domain/entity/user.entity';
import { FriendRequestStatus } from '../../domain/enum/friend-request-status.enum';

@Injectable()
export class RelationsService extends MixinsCrudService<FriendRequestEntity> {
  constructor(
    @InjectRepository(FriendRequestEntity)
    private relationsRepository: Repository<FriendRequestEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {
    super(relationsRepository, new FriendRequestEntity());
  }

  async registerFriendRequest(
    friendRequestDto: FriendRequestDto,
  ): Promise<FriendRequestDto> {
    const sender = await this.usersRepository.findOneBy({
      id: friendRequestDto.senderId,
    });

    const receiver = await this.usersRepository.findOneBy({
      id: friendRequestDto.receiverId,
    });

    if (!sender || !receiver) {
      throw new NotFoundException('Sender or recipient does not exist');
    }

    try {
      const newEntity = await this.relationsRepository.save({
        sender: sender,
        receiver: receiver,
        requestStatus: FriendRequestStatus.PENDING,
      });
      return {
        senderId: newEntity.sender.id,
        receiverId: newEntity.receiver.id,
        id: newEntity.id,
        requestStatus: newEntity.requestStatus,
      };
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Sender or recipient does not exist');
    }
  }
}
