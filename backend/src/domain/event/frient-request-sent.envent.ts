export class FriendRequestSentEvent {
  constructor(
    public readonly senderId: number,
    public readonly receiverId: number,
    public readonly requestId: number,
    public readonly message: string,
  ) {}
}
