import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationSocketDto } from '../../application/dto/response/notification.dto';
import { NotificationGateway } from '../../api/gateway/notification.gateway';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationGateway: NotificationGateway) {}

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
}
