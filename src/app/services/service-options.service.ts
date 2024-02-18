import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import {
  OptionsResponse,
  ServiceOptionsInterface,
} from '../model/serviceOptions.interface';
import { BASE_URL } from '../constants/api-constants';

@Injectable({
  providedIn: 'root',
})
export class ServiceOptionsService {
  constructor(private http: HttpClient) {}

  getServiceOptions(): Observable<OptionsResponse> {
    return this.http.get<OptionsResponse>(`${BASE_URL}service_options`).pipe(
      catchError((error) => {
        console.error('An error occurred:', error);
        return throwError(
          () =>
            new Error(
              'An error occurred while fetching the service options with ID.'
            )
        );
      })
    );
  }
}
