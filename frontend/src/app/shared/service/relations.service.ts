import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Observable, tap } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RelationsService {
  isRequestAccepted: WritableSignal<boolean> = signal(false);

  private readonly apiService = inject(ApiService);

  handelFriendRequest(
    requestId: number,
    accepted: boolean,
  ): Observable<boolean> {
    const httpParam = new HttpParams().set('accept', accepted);
    return this.apiService
      .getRequest<boolean>(`relations/${requestId}/validate`, true, httpParam)
      .pipe(tap((result) => this.isRequestAccepted.set(result)));
  }
}
