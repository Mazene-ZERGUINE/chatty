import { Component, DestroyRef, effect, inject, OnInit } from '@angular/core';
import { MessagesListComponent } from '../../shared/components/messages-list/messages-list.component';
import { SideBarMenuComponent } from '../../core/layout/side-bar-menu/side-bar-menu.component';
import { TopBarComponent } from '../../core/layout/top-bar/top-bar.component';
import { combineLatest } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommunityService } from './community.service';

import { JsonPipe, NgClass, UpperCasePipe } from '@angular/common';
import { UserCardComponent } from './user-card/user-card.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { UserInfoCardComponent } from '../../shared/components/user-info-card/user-info-card.component';
import { AuthService } from '../../core/auth/auth.service';
import { NotifierService } from '../../core/services/notifier.service';

export const CommunityScreens = {
  users: 'users',
  groups: 'groups',
  requests: 'requests',
} as const;

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [
    MessagesListComponent,
    SideBarMenuComponent,
    TopBarComponent,
    NgClass,
    UserCardComponent,
    SearchBarComponent,
    UserInfoCardComponent,
    JsonPipe,
    UpperCasePipe,
  ],
  templateUrl: './community.component.html',
  styleUrl: './community.component.scss',
})
export class CommunityComponent implements OnInit {
  currentScreen: string = CommunityScreens.users;
  displayInfoScreen = false;
  selectedUserId?: string;

  protected readonly communityService = inject(CommunityService);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly authService: AuthService = inject(AuthService);
  protected readonly notifierService: NotifierService = inject(NotifierService);

  protected users = this.communityService.filteredUsers;
  protected groups = this.communityService.groupsList;
  protected readonly friendRequests = this.communityService.receivedRequests;
  protected readonly event = event;

  constructor() {
    effect(() => {
      if (this.communityService.friendRequestSent()) {
        this.notifierService.showSuccessMessage('Friend request sent', 'Sent!');
        this.communityService
          .getSentRequests()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe();
        this.communityService.friendRequestSent.set(false);
      }
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  filterUsers(searchValue: string): void {
    this.communityService.setSearchValue(searchValue);
  }

  onScreenChange(screen: string): void {
    this.currentScreen = screen;
  }

  displayUserInfo(userId: string): void {
    if (this.selectedUserId === userId) {
      this.displayInfoScreen = !this.displayInfoScreen;
    } else {
      this.displayInfoScreen = true;
      this.selectedUserId = userId;
    }
  }

  closeDisplayScreen(): void {
    this.displayInfoScreen = false;
    this.selectedUserId = undefined;
  }

  sendFriendRequest(receiverId: string): void {
    const payload = {
      senderId: this.authService.userInformation()?.id as string,
      receiverId: receiverId,
    };
    this.communityService
      .sendFriendRequest(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  isRequestSent(userId: string): boolean {
    return this.communityService
      .sentRequests()
      .map((request) => request.receiver.id)
      .includes(userId);
  }

  private loadData(): void {
    combineLatest([
      this.communityService.getAllGroups$(),
      this.communityService.getAllUsers$(),
      this.communityService.getSentRequests(),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
