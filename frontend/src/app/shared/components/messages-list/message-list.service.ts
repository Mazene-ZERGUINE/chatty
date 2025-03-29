import { Injectable, signal, WritableSignal } from '@angular/core';
import { MessageListFragment } from './messages-list.component';

@Injectable({
  providedIn: 'root',
})
export class MessageListService {
  currentList: WritableSignal<MessageListFragment> = signal(
    MessageListFragment.ALL_CONTACTS,
  );

  updateList(fragment: MessageListFragment): void {
    this.currentList.set(fragment);
  }
}
