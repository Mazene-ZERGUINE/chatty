import {
  computed,
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Observable, tap } from 'rxjs';
import { Group } from '../../core/models/group.interface';
import { User } from '../../core/models/user.interface';
import { FriendRequest } from '../../core/models/friend-request.interface';
import { AuthService } from '../../core/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CommunityService {
  authService = inject(AuthService);

  groupsList: WritableSignal<Group[]> = signal([]);
  usersList: WritableSignal<User[]> = signal([]);
  searchValue: WritableSignal<string> = signal<string>('');
  friendRequestSent = signal(false);
  sentRequests: WritableSignal<FriendRequest[]> = signal([]);
  receivedRequests: WritableSignal<FriendRequest[]> = signal([]);

  filteredUsers: Signal<User[]> = computed(() => {
    const term = this.searchValue().toLowerCase();
    return this.usersList().filter((user) => {
      return (
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.phoneNumber.includes(term)
      );
    });
  });

  private readonly apiService = inject(ApiService);

  setSearchValue(searchValue: string): void {
    this.searchValue.set(searchValue);
  }

  getAllGroups$(): Observable<Group[]> {
    return this.apiService
      .getRequest<Group[]>('groups')
      .pipe(tap((groups) => this.groupsList.set(groups)));
  }

  getAllUsers$(): Observable<User[]> {
    return this.apiService
      .getRequest<User[]>('users')
      .pipe(tap((users) => this.usersList.set(users)));
  }

  sendFriendRequest(payload: {
    senderId: string;
    receiverId: string;
  }): Observable<void> {
    return this.apiService
      .postRequest<{ senderId: string; receiverId: string }, void>(
        'relations/',
        payload,
      )
      .pipe(tap(() => this.friendRequestSent.set(true)));
  }

  getSentRequests(): Observable<FriendRequest[]> {
    return this.apiService.getRequest<FriendRequest[]>('relations').pipe(
      tap((requests) => {
        const userId = this.authService.userInformation()?.id as string;
        const sentRequests = requests.filter(
          (request) => request.sender.id === userId,
        );
        this.sentRequests.set(sentRequests);
        const receivedRequests = requests.filter(
          (request) => request.receiver.id === userId,
        );
        this.receivedRequests.set(receivedRequests);
      }),
    );
  }
}
