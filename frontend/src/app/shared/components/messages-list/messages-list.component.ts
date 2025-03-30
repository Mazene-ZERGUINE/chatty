import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { NgClass } from '@angular/common';
import { MessageListService } from './message-list.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

export enum MessageListFragment {
  GROUPS = 'GROUPS',
  CONTACT = 'CONTACT',
  ALL_CONTACTS = 'ALL_CONTACTS',
}

@Component({
  selector: 'app-messages-list',
  standalone: true,
  imports: [SearchBarComponent, NgClass, RouterLink],
  templateUrl: './messages-list.component.html',
  styleUrl: './messages-list.component.scss',
})
export class MessagesListComponent implements OnInit {
  readonly messageListService = inject(MessageListService);
  readonly destroyRef = inject(DestroyRef);

  currentList = this.messageListService.currentList;
  contactList = this.messageListService.contactsList;

  protected readonly MessageListFragment = MessageListFragment;

  ngOnInit(): void {
    this.messageListService
      .getUserContact$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(console.log);
  }

  onFragmentChange(fragment: MessageListFragment): void {
    this.messageListService.updateList(fragment);
  }
}
