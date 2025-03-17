import { NotificationType } from '../../../domain/enum/notification-type.enum';
import { UserDto } from './user.dto';

export interface NotificationDto {
  id: number;
  content: string;
  type: NotificationType;
  sender: UserDto;
  user: UserDto;
}

export interface NotificationSocketDto {
  id: number;
  content: string;
  type: NotificationType;
  senderId: number;
  userId: number;
}
