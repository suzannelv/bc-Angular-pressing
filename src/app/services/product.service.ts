import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  EMPTY,
  Observable,
  catchError,
  expand,
  map,
  reduce,
  throwError,
} from 'rxjs';
import { ProductInterface, ProductResponse } from '../model/product.interface';
import { BASE_URL } from '../constants/api-constants';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProductAll(): Observable<ProductInterface[]> {
    let initialUrl = `${BASE_URL}products`;

    return this.http.get<any>(initialUrl).pipe(
      expand((res) => {
        return res['hydra:view'] && res['hydra:view']['hydra:next']
          ? this.http.get<ProductResponse>(res['hydra:view']['hydra:next'])
          : EMPTY;
      }),

      map((res) => (res ? res['hydra:member'] : [])),
      reduce<ProductInterface[], ProductInterface[]>(
        (acc, cur) => [...acc, ...cur],
        []
      ),
      catchError(() => {
        return throwError(
          () =>
            new Error(
              'Une erreur survenue lors de la récupération des produits.'
            )
        );
      })
    );
  }

  getProductById(productId: number): Observable<ProductInterface> {
    return this.http
      .get<ProductInterface>(`${BASE_URL}products/${productId}`)
      .pipe(
        catchError(() => {
          return throwError(
            () =>
              new Error(
                `Une erreur survenue lors de la récupération le produit par ID ${productId}`
              )
          );
        })
      );
  }
}
