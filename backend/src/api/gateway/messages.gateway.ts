import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from '../../application/dto/request/create-message.dto';
import { ChatService } from '../../application/service/chat.service';
import { Message } from '../../domain/entity/message.schema';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;
  private activeUsers = new Map<string, string>();

  constructor(private readonly messageService: ChatService) {}

  handleConnection(client: Socket): void {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.activeUsers.set(userId, client.id);
    }
  }

  handleDisconnect(client: Socket): void {
    const userId = [...this.activeUsers.entries()].find(
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      ([_, socketId]) => socketId === client.id,
    )?.[0];
    if (userId) {
      this.activeUsers.delete(userId);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() messageDto: CreateMessageDto,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @ConnectedSocket() client: Socket,
  ): Promise<Message> {
    console.log(messageDto);
    const message = await this.messageService.create(messageDto);

    const receiverSocketId = this.activeUsers.get(messageDto.receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('newMessage', message);
    }
    return message;
  }

  @SubscribeMessage('typing')
  async handleTyping(
    @MessageBody() data: { senderId: string; receiverId: string },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { senderId, receiverId } = data;

    const receiverSocketId = this.activeUsers.get(receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('typing', { senderId });
    }
  }

  @SubscribeMessage('read_messages')
  async handleReadMessages(
    @MessageBody() data: { readerId: string; senderId: string },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { readerId, senderId } = data;

    await this.messageService.markMessagesAsRead(senderId, readerId);
    const senderSocketId = this.activeUsers.get(senderId);
    if (senderSocketId) {
      this.server.to(senderSocketId).emit('messages_read', {
        readerId,
      });
    }
  }
}
