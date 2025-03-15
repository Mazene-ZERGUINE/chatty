import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MessagesListComponent } from '../../shared/components/messages-list/messages-list.component';
import { SideBarMenuComponent } from '../../core/layout/side-bar-menu/side-bar-menu.component';
import { TopBarComponent } from '../../shared/components/top-bar/top-bar.component';
import { combineLatest, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommunityService } from './community.service';

import { NgClass } from '@angular/common';
import { UserCardComponent } from './user-card/user-card.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';

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
  ],
  templateUrl: './community.component.html',
  styleUrl: './community.component.scss',
})
export class CommunityComponent implements OnInit {
  readonly communityService = inject(CommunityService);
  protected users = this.communityService.usersList;
  protected groups = this.communityService.groupsList;

  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    combineLatest([
      this.communityService.getAllGroups$(),
      this.communityService.getAllUsers$(),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef), tap(console.log))
      .subscribe();
  }
}
