import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  output,
  signal,
  WritableSignal,
} from '@angular/core';
import { DiscussionService } from './services/discussion.service';
import { AuthService } from '../../core/auth/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map, Observable, switchMap, combineLatest, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../core/models/user.interface';
import { ChatSocketService } from './services/chat-socket.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-discussion',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './discussion.component.html',
  styleUrl: './discussion.component.scss',
})
export class DiscussionComponent implements OnInit {
  contactIdEvent = output<number>();

  readonly discussionService = inject(DiscussionService);
  readonly authService = inject(AuthService);
  readonly destroyRef = inject(DestroyRef);
  readonly activatedRoute = inject(ActivatedRoute);
  readonly chatService = inject(ChatSocketService);

  messages = this.discussionService.messagesList;
  messageText = '';

  protected userId = this.authService.userInformation()?.id;
  protected contactInfo: WritableSignal<User | undefined> = signal(undefined);
  protected readonly Number = Number;

  private readonly contactId$: Observable<number> =
    this.activatedRoute.params.pipe(
      filter((params) => !!params['contactId']),
      map((params) => Number(params['contactId'])),
      tap((contactId) => this.contactIdEvent.emit(contactId)),
      takeUntilDestroyed(this.destroyRef),
    );

  ngOnInit(): void {
    this.loadConversation();
  }

  sendMessage(): void {
    if (this.messageText.length > 0) {
      const message = {
        senderId: Number(this.userId),
        receiverId: Number(this.contactInfo()?.id),
        content: this.messageText,
      };
      this.chatService.sendMessage(message);
      //this.messages.set([... , message]);
      this.messageText = '';
    }
  }

  private loadConversation(): void {
    if (this.userId) {
      this.contactId$
        .pipe(
          switchMap((contactId) => {
            const contact = this.authService
              .userInformation()
              ?.contacts.find((contact) => Number(contact.id) === contactId);
            this.contactInfo.set(contact);
            return this.discussionService.getUserConversation$(
              this.userId!,
              contactId,
            );
          }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    } else {
      combineLatest([this.contactId$, this.authService.getUserInformation$()])
        .pipe(
          switchMap(([contactId, user]) => {
            this.userId = user.id;
            const contact = user.contacts.find(
              (contact) => Number(contact.id) === contactId,
            );
            this.contactInfo.set(contact);
            return this.discussionService.getUserConversation$(
              user.id,
              contactId,
            );
          }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    }
  }
}
