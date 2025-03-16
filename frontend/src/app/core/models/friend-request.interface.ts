export interface FriendRequest {
  id: number;
  requestStatus: FriendRequestStatus;
  senderId: number;
  receiverId: number;
}

export enum FriendRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}
