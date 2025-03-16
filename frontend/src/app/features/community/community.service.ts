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

@Injectable({
  providedIn: 'root',
})
export class CommunityService {
  groupsList: WritableSignal<Group[]> = signal([]);
  usersList: WritableSignal<User[]> = signal([]);
  searchValue: WritableSignal<string> = signal<string>('');

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
}
