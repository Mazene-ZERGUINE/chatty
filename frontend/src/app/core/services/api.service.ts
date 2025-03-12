import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http';
import { environment } from '../../../environment/env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly apiUrl: string = environment.apiUrl;

  postRequest<PAYLOAD, RESPONSE>(
    url: string,
    payload: PAYLOAD,
  ): Observable<RESPONSE> {
    return this.httpClient.post<RESPONSE>(this.getUrlPath(url), payload);
  }

  getRequest<RESPONSE>(
    url: string,
    httpParams?: HttpParams,
  ): Observable<RESPONSE> {
    if (httpParams) {
      return this.httpClient.get<RESPONSE>(this.getUrlPath(url), {
        params: httpParams,
      });
    } else {
      return this.httpClient.get<RESPONSE>(this.getUrlPath(url));
    }
  }

  deleteRequest(url: string): Observable<void> {
    return this.httpClient.delete<void>(this.getUrlPath(url));
  }

  patchRequest<PAYLOAD, RESPONSE>(
    url: string,
    payload: PAYLOAD,
  ): Observable<RESPONSE> {
    return this.httpClient.patch<RESPONSE>(this.getUrlPath(url), payload);
  }

  UploadFileRequest<RESPONSE>(
    formData: FormData,
    url: string,
  ): Observable<HttpEvent<RESPONSE>> {
    console.log(url);
    return this.httpClient.post<RESPONSE>(this.getUrlPath(url), formData, {
      reportProgress: true,
      observe: 'events',
    });
  }

  private getUrlPath(path: string): string {
    return `${this.apiUrl}/${path}`;
  }
}
