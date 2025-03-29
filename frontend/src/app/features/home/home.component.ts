import { Component } from '@angular/core';
import { SideBarMenuComponent } from '../../core/layout/side-bar-menu/side-bar-menu.component';
import { MessagesListComponent } from '../../shared/components/messages-list/messages-list.component';
import { TopBarComponent } from '../../core/layout/top-bar/top-bar.component';
import { DiscussionComponent } from '../discussion/discussion.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SideBarMenuComponent,
    MessagesListComponent,
    TopBarComponent,
    DiscussionComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  contactId!: number;

  setContactId(event: number): void {
    this.contactId = event;
  }
}
