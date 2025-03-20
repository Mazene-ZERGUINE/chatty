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
    senderId: number;
    notification: NotificationSocketDto;
  }): Promise<void> {
    this.notificationGateway.sendNotification(String(event.receiverId), {
      id: event.notification.id,
      content: event.notification.content,
      type: event.notification.type,
      senderId: event.senderId,
    } as NotificationSocketDto);
  }

  async getUsersNotifications(id: number): Promise<NotificationEntity[]> {
    try {
      await this.notificationRepository.findOneByOrFail({ id: id });
      return await this.notificationRepository.find({
        where: { user: { id: id } },
        relations: ['user', 'sender'],
      });
    } catch (error) {
      console.error('User not found', error);
      throw new NotFoundException(`User ${id} not found`);
    }
  }
}
