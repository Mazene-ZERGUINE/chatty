import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable, tap } from 'rxjs';
import { Message } from '../../../core/models/message.interface';

@Injectable({
  providedIn: 'root',
})
export class DiscussionService {
  messagesList: WritableSignal<Message[]> = signal([]);

  private readonly apiService = inject(ApiService);

  getUserConversation$(
    userId: string,
    contactId: number,
  ): Observable<Message[]> {
    return this.apiService
      .getRequest<Message[]>(`chat/${userId}/${contactId}`)
      .pipe(tap(this.messagesList.set));
  }
}
