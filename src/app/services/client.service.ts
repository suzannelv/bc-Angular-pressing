import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { UserInterface } from '../model/user.interface';
import { BASE_URL } from '../constants/api-constants';
import { orderDetailResponse } from '../model/orderDetail.interface';

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
    const headers = new HttpHeaders({
      'Content-Type': 'application/merge-patch+json',
    });
    return this.http
      .patch<UserInterface>(`${BASE_URL}clients/${clientId}`, body, {
        headers: headers,
      })
      .pipe(
        catchError(() => {
          return throwError(
            () =>
              new Error(
                `Une erreur survenue lors de la mise à jour de l'adresse de client ${clientId}`
              )
          );
        })
      );
  }

  getOrderListByClientId(clientId: number): Observable<orderDetailResponse> {
    return this.http
      .get<orderDetailResponse>(
        `${BASE_URL}order_details?client=${clientId}&order_details[createdAt]=desc`
      )
      .pipe(
        catchError(() => {
          return throwError(
            () =>
              new Error(
                'Echec pour récupérer le détail de commande pour client'
              )
          );
        })
      );
  }
}
