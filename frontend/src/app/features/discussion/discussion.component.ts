import { Component, DestroyRef, inject, OnInit, output } from '@angular/core';
import { DiscussionService } from './discussion.service';
import { AuthService } from '../../core/auth/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map, Observable, switchMap, combineLatest, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-discussion',
  standalone: true,
  imports: [],
  templateUrl: './discussion.component.html',
  styleUrl: './discussion.component.scss',
})
export class DiscussionComponent implements OnInit {
  contactIdEvent = output<number>();

  private readonly discussionService = inject(DiscussionService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly activatedRoute = inject(ActivatedRoute);

  private readonly userId = this.authService.userInformation()?.id;

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

  private loadConversation(): void {
    if (this.userId) {
      this.contactId$
        .pipe(
          switchMap((contactId) =>
            this.discussionService.getUserConversation$(
              this.userId!,
              contactId,
            ),
          ),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    } else {
      combineLatest([this.contactId$, this.authService.getUserInformation$()])
        .pipe(
          switchMap(([contactId, user]) =>
            this.discussionService.getUserConversation$(user.id, contactId),
          ),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    }
  }
}
