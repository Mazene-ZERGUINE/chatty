import { Component, inject } from '@angular/core';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { NgClass } from '@angular/common';
import { MessageListService } from './message-list.service';

export enum MessageListFragment {
  GROUPS = 'GROUPS',
  CONTACT = 'CONTACT',
  ALL_CONTACTS = 'ALL_CONTACTS',
}

@Component({
  selector: 'app-messages-list',
  standalone: true,
  imports: [SearchBarComponent, NgClass],
  templateUrl: './messages-list.component.html',
  styleUrl: './messages-list.component.scss',
})
export class MessagesListComponent {
  readonly messageListService = inject(MessageListService);
  currentList = this.messageListService.currentList;

  protected readonly MessageListFragment = MessageListFragment;

  onFragmentChange(fragment: MessageListFragment): void {
    this.messageListService.updateList(fragment);
  }
}
