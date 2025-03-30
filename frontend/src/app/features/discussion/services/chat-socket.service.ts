// chat-socket.service.ts
import { inject, Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, tap } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { Message } from '../../../core/models/message.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatSocketService {
  userId = this.authService.userInformation()?.id;

  private socket: Socket;
  private messagesSubject = new BehaviorSubject<Message[]>(null);
  private readonly authService = inject(AuthService);

  constructor() {
    if (!this.userId) {
      this.authService
        .getUserInformation$()
        .pipe(tap((user) => (this.userId = user.id)))
        .subscribe();
    }
    this.socket = io('http://localhost:3000', {
      query: {
        userId: this.userId,
      },
    });

    this.socket.on('connect', () => {
      console.log('Connected to socket server:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    this.socket.on('newMessage', (message) => {
      this.messagesSubject.next(message);
    });
  }

  sendMessage(message: {
    senderId: number;
    receiverId: number;
    content: string;
  }): void {
    this.socket.emit('sendMessage', message);
  }

  listenForMessages(): void {
    return this.messagesSubject.asObservable();
  }
}
