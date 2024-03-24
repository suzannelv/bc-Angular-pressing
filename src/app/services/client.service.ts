import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { UserInterface } from '../model/user.interface';
import { BASE_URL } from '../constants/api-constants';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(private http: HttpClient) {}

  updateClientAddress(
    clientId: number,
    newAddress: string
  ): Observable<UserInterface> {
    const body = { adress: newAddress };
    return this.http
      .patch<UserInterface>(`${BASE_URL}clients/${clientId}`, body)
      .pipe(
        catchError((error) => {
          console.error('An error occurred:', error);
          return throwError(
            () =>
              new Error(
                `An error occurred while update address with ID ${clientId}`
              )
          );
        })
      );
  }
}
