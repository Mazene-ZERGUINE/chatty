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
    withCredentials = true,
  ): Observable<RESPONSE> {
    return this.httpClient.post<RESPONSE>(this.getUrlPath(url), payload, {
      withCredentials: withCredentials,
    });
  }

  getRequest<RESPONSE>(
    url: string,
    withCredentials = true,
    httpParams?: HttpParams,
  ): Observable<RESPONSE> {
    if (httpParams) {
      return this.httpClient.get<RESPONSE>(this.getUrlPath(url), {
        params: httpParams,
        withCredentials: withCredentials,
      });
    } else {
      return this.httpClient.get<RESPONSE>(this.getUrlPath(url), {
        withCredentials: withCredentials,
      });
    }
  }

  deleteRequest(url: string, withCredentials = true): Observable<void> {
    return this.httpClient.delete<void>(this.getUrlPath(url), {
      withCredentials: withCredentials,
    });
  }

  patchRequest<PAYLOAD, RESPONSE>(
    url: string,
    payload: PAYLOAD,
    withCredentials = true,
  ): Observable<RESPONSE> {
    return this.httpClient.patch<RESPONSE>(this.getUrlPath(url), payload, {
      withCredentials: withCredentials,
    });
  }

  UploadFileRequest<RESPONSE>(
    formData: FormData,
    url: string,
    withCredentials = true,
  ): Observable<HttpEvent<RESPONSE>> {
    console.log(url);
    return this.httpClient.post<RESPONSE>(this.getUrlPath(url), formData, {
      reportProgress: true,
      observe: 'events',
      withCredentials: withCredentials,
    });
  }

  private getUrlPath(path: string): string {
    return `${this.apiUrl}/${path}`;
  }
}
