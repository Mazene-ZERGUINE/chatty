export interface Message {
  senderId: number;

  receiverId: number;

  content: string;

  isRead: boolean;

  chatRoomId?: number;

  isGroupChat: boolean;
}
