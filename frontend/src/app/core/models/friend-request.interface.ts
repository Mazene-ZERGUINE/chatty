import { User } from './user.interface';

export interface FriendRequest {
  id: number;
  requestStatus: FriendRequestStatus;
  sender: User;
  receiver: User;
}

export enum FriendRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}
