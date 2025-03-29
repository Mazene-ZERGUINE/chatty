import { Injectable, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationSocketDto } from '../../application/dto/response/notification.dto';
import { NotificationGateway } from '../../api/gateway/notification.gateway';
import { MixinsCrudService } from 'nestjs-crud-mixins';
import { NotificationEntity } from '../../domain/entity/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService extends MixinsCrudService<NotificationEntity> {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    private readonly notificationGateway: NotificationGateway,
  ) {
    super(notificationRepository, new NotificationEntity());
  }

  @OnEvent('notification.created')
  async handleNotificationCreated(event: {
    receiverId: number;
    senderId?: number;
    notification: NotificationSocketDto;
  }): Promise<void> {
    console.log(event.notification);
    this.notificationGateway.sendNotification(String(event.receiverId), {
      id: event.notification.id,
      content: event.notification.content,
      type: event.notification.type,
      senderId: event.senderId,
    } as NotificationSocketDto);
  }

  async getUsersNotifications(id: number): Promise<NotificationEntity[]> {
    return await this.notificationRepository.find({
      where: { user: { id: id }, isRead: false },
      relations: ['user', 'sender'],
    });
  }

  async setNotificationToRead(notificationId: number): Promise<void> {
    try {
      const notification = await this.notificationRepository.findOneByOrFail({
        id: notificationId,
      });
      notification.isRead = true;
      await this.notificationRepository.save(notification);
    } catch (error) {
      throw new NotFoundException('Could not find notification');
    }
  }
}
