export class RequestAnsweredEvent {
  constructor(
    public requestId: number,
    public response: boolean,
    public message: string,
    public userId: number,
    public receiverId: number,
  ) {}
}
