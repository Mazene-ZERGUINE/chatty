import { Injectable, NotFoundException } from '@nestjs/common';
import { MixinsCrudService } from 'nestjs-crud-mixins';
import { FriendRequestEntity } from '../../domain/entity/friend-request.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateFriendRequestDto,
  FriendRequestDto,
} from '../dto/request/friend-request.dto';
import { UserEntity } from '../../domain/entity/user.entity';
import { FriendRequestStatus } from '../../domain/enum/friend-request-status.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { FriendRequestSentEvent } from '../../domain/event/frient-request-sent.envent';
import { RequestAnsweredEvent } from '../../domain/event/request-answerd.event';

@Injectable()
export class RelationsService extends MixinsCrudService<FriendRequestEntity> {
  constructor(
    @InjectRepository(FriendRequestEntity)
    private relationsRepository: Repository<FriendRequestEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super(relationsRepository, new FriendRequestEntity());
  }

  async registerFriendRequest({
    senderId,
    receiverId,
  }: CreateFriendRequestDto): Promise<FriendRequestDto> {
    const [sender, receiver] = await Promise.all([
      this.usersRepository.findOneBy({ id: senderId }),
      this.usersRepository.findOneBy({ id: receiverId }),
    ]);

    if (!sender || !receiver) {
      throw new NotFoundException('Sender or recipient does not exist');
    }

    try {
      const newEntity = await this.relationsRepository.save({
        sender,
        receiver,
        requestStatus: FriendRequestStatus.PENDING,
      });
      // eslint-disable-next-line max-len
      const message = `You have received a new friend request from ${sender.firstName.toUpperCase()} ${sender.lastName.toUpperCase()}`;
      this.eventEmitter.emit(
        'friend_request.sent',
        new FriendRequestSentEvent(senderId, receiverId, newEntity.id, message),
      );

      return {
        id: newEntity.id,
        senderId,
        receiverId,
        requestStatus: newEntity.requestStatus,
      };
    } catch (error) {
      console.error(error);
      throw new NotFoundException('Could not create friend request');
    }
  }

  async handelFriendRequest(
    requestId: number,
    isAccepted: boolean,
  ): Promise<boolean> {
    try {
      const request = await this.relationsRepository.findOneOrFail({
        where: { id: requestId },
        relations: ['sender', 'receiver'],
      });

      const { response, status } = await this.processRequest(
        isAccepted,
        request,
      );

      this.eventEmitter.emit(
        'request.answered',
        new RequestAnsweredEvent(
          requestId,
          status,
          response,
          request.sender.id,
          request.receiver.id,
        ),
      );

      await this.relationsRepository.save(request);
      return status;
    } catch (error) {
      console.error(error);
      throw new NotFoundException('Could not find relation request');
    }
  }

  private async processRequest(
    isAccepted: boolean,
    request: FriendRequestEntity,
  ): Promise<{ response: string; status: boolean }> {
    if (isAccepted) {
      const sender = await this.usersRepository.findOne({
        where: { id: request.sender.id },
        relations: ['contacts'],
      });
      const reciver = await this.usersRepository.findOne({
        where: { id: request.receiver.id },
        relations: ['contacts'],
      });

      sender.contacts.push(reciver);
      reciver.contacts.push(sender);

      await this.usersRepository.save(sender);
      await this.usersRepository.save(reciver);

      request.requestStatus = FriendRequestStatus.ACCEPTED;

      return {
        // eslint-disable-next-line max-len
        response: `Friend Request has been accepted Accepted by ${request.receiver.lastName.toUpperCase()} ${request.receiver.firstName.toUpperCase()}`,
        status: true,
      };
    } else {
      request.requestStatus = FriendRequestStatus.DECLINED;

      return {
        response: `Request Declined by ${request.receiver.lastName}`,
        status: true,
      };
    }
  }
}
