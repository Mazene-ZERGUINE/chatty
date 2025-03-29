import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { MessageListFragment } from './messages-list.component';
import { User } from '../../../core/models/user.interface';
import { AuthService } from '../../../core/auth/auth.service';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageListService {
  readonly authService = inject(AuthService);

  currentList: WritableSignal<MessageListFragment> = signal(
    MessageListFragment.ALL_CONTACTS,
  );

  readonly contactsList: WritableSignal<User[]> = signal([]);

  updateList(fragment: MessageListFragment): void {
    this.currentList.set(fragment);
  }

  getUserContact$(): Observable<User> {
    const user = this.authService.userInformation();
    if (user) {
      this.contactsList.set(user.contacts);
      return of(user);
    }
    return this.authService
      .getUserInformation$()
      .pipe(tap((user) => this.contactsList.set(user.contacts)));
  }
}
