import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationSocketDto } from '../../application/dto/response/notification.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Server;

  private activeUsers = new Map<string, string>();

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

  sendNotification(userId: string, notification: NotificationSocketDto): void {
    const socketId = this.activeUsers.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('new_notification', notification);
    }
  }

  async isUserOnline(userId: string): Promise<boolean> {
    return this.activeUsers.has(userId);
  }
}
