import { User } from './user.interface';

export interface NotificationPayload {
  id: number;
  content: string;
  notificationType: NotificationType;
  sender: User;
  user: User;
}

export enum NotificationType {
  MESSAGE_NOTIFICATION = 'MESSAGE',
  REQUEST_NOTIFICATION = 'REQUEST',
  SYSTEME_NOTIFICATION = 'SYSTEM',
}
