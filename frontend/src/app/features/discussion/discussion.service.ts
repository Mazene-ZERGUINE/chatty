import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { EMPTY, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DiscussionService {
  readonly apiService = inject(ApiService);

  getUserConversation$(userId: string, contactId: number): Observable<void> {
    console.log(userId, contactId);
    return EMPTY;
  }
}
