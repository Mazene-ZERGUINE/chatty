export interface NotificationPayload {
  id: number;
  content: string;
  type: NotificationType;
  senderId: number;
  userId: number;
}

export enum NotificationType {
  MESSAGE_NOTIFICATION = 'MESSAGE',
  REQUEST_NOTIFICATION = 'REQUEST',
  SYSTEME_NOTIFICATION = 'SYSTEM',
}
