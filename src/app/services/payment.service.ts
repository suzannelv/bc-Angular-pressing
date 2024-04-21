import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { BASE_URL } from '../constants/api-constants';
import { PaymentResponse } from '../model/payment.interface';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  getPaymentMethods(): Observable<PaymentResponse> {
    return this.http.get<PaymentResponse>(`${BASE_URL}payments`).pipe(
      catchError(() => {
        return throwError(
          () =>
            new Error(
              'Une erreur survenue lors de la récupération des moyens de paiement.'
            )
        );
      })
    );
  }
}
