import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { UserInterface } from '../model/user.interface';
import { BASE_URL } from '../constants/api-constants';
import {
  OrderDetailInterface,
  orderDetailResponse,
} from '../model/orderDetail.interface';

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

  getOrderListByClientId(clientId: number): Observable<orderDetailResponse> {
    return this.http
      .get<orderDetailResponse>(
        `${BASE_URL}order_details?client=${clientId}&order_details[createdAt]=desc`
      )
      .pipe(
        catchError((error) => {
          console.error('An error occurred fetching order details:', error);
          return throwError(() => new Error('Failed to fetch order details'));
        })
      );
  }
}
