import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ZipCodeResponse } from '../model/zipCode.interface';
import { BASE_URL } from '../constants/api-constants';

@Injectable({
  providedIn: 'root',
})
export class ZipCodeService {
  constructor(private http: HttpClient) {}

  getZipCodeAll(): Observable<ZipCodeResponse> {
    return this.http.get<ZipCodeResponse>(`${BASE_URL}zip_codes`).pipe(
      catchError((error) => {
        console.error('An error occurred:', error);
        return throwError(
          () => new Error('An error occurred while fetching the zipcode.')
        );
      })
    );
  }
}
