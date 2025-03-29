import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { MixinsCrudController } from 'nestjs-crud-mixins';
import { NotificationEntity } from '../../domain/entity/notification.entity';
import { NotificationService } from '../../application/service/notification.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('notifications')
export class NotificationController extends MixinsCrudController<
  NotificationEntity,
  NotificationService
> {
  constructor(private readonly notificationService: NotificationService) {
    super(notificationService, new NotificationEntity());
  }

  @Get('user/:id')
  @HttpCode(HttpStatus.OK)
  async getUsersNotification(
    @Param('id') id: number,
  ): Promise<NotificationEntity[]> {
    return this.notificationService.getUsersNotifications(id);
  }

  @Get('view/:id')
  @HttpCode(HttpStatus.OK)
  async viewNotification(@Param('id') id: number): Promise<void> {
    await this.notificationService.setNotificationToRead(id);
  }
}
