import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import {
  OrderDetailInterface,
  orderDetailResponse,
} from '../model/orderDetail.interface';
import { BASE_URL } from '../constants/api-constants';

@Injectable({
  providedIn: 'root',
})
export class OrderDetailService {
  constructor(private http: HttpClient) {}

  getOrderDetails(): Observable<orderDetailResponse> {
    return this.http.get<orderDetailResponse>(`${BASE_URL}order_details`).pipe(
      catchError((error) => {
        console.error('An error occurred:', error);
        return throwError(
          () => new Error('An error occurred while fetching the materials.')
        );
      })
    );
  }
}
