import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CreateProductSelectedInterface,
  ProductSelectedInterface,
  ProductSelectedResponse,
} from '../model/productSelected.interface';
import { BASE_URL } from '../constants/api-constants';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductSelectedService {
  constructor(private http: HttpClient) {}

  getProductSelectedAll(): Observable<ProductSelectedResponse> {
    return this.http
      .get<ProductSelectedResponse>(`${BASE_URL}product_selecteds`)
      .pipe(
        catchError(() => {
          return throwError(
            () =>
              new Error(
                'Une erreur survenue lors de la récupération des produits sélectionnés.'
              )
          );
        })
      );
  }

  createProductSelected(
    productSelectedData: CreateProductSelectedInterface
  ): Observable<CreateProductSelectedInterface> {
    return this.http
      .post<CreateProductSelectedInterface>(
        `${BASE_URL}product_selecteds`,
        productSelectedData
      )
      .pipe(
        catchError(() => {
          return throwError(
            () => new Error('Echouer de créer le produit sélectionné.')
          );
        })
      );
  }
}
