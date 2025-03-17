import { Injectable, OnModuleInit } from '@nestjs/common';
import { OnEvent, EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendRequestSentEvent } from '../../domain/event/frient-request-sent.envent';
import { NotificationEntity } from '../../domain/entity/notification.entity';
import { NotificationType } from '../../domain/enum/notification-type.enum';

@Injectable()
export class FriendRequestListener implements OnModuleInit {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
  ) {}

  onModuleInit(): void {}

  @OnEvent('friend_request.sent')
  async handelFriendRequestSentEvent(
    event: FriendRequestSentEvent,
  ): Promise<void> {
    const notification = this.notificationRepository.create({
      user: { id: event.receiverId },
      sender: { id: event.senderId },
      title: 'New friend request',
      content: 'You have received a new friend request',
      notificationType: NotificationType.REQUEST_NOTIFICATION,
    });

    await this.notificationRepository.save(notification);

    this.eventEmitter.emit('notification.created', {
      receiverId: event.receiverId,
      senderId: event.senderId,
      notification,
    });
  }
}
