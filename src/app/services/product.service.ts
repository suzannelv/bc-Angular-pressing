import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  EMPTY,
  Observable,
  catchError,
  expand,
  map,
  of,
  reduce,
  tap,
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
      // tap((data) => console.log('Current page data:', data)),
      map((res) => (res ? res['hydra:member'] : [])),
      reduce<ProductInterface[], ProductInterface[]>(
        (acc, cur) => [...acc, ...cur],
        []
      ),
      catchError((error) => {
        console.error('An error occurred:', error);
        return throwError(
          () => new Error('An error occurred while fetching products')
        );
      })
    );
  }

  getProductById(productId: number): Observable<ProductInterface> {
    return this.http
      .get<ProductInterface>(`${BASE_URL}products/${productId}`)
      .pipe(
        catchError((error) => {
          console.error('An error occurred:', error);
          return throwError(
            () =>
              new Error(
                `An error occurred while fetching the product with ID ${productId}`
              )
          );
        })
      );
  }
}
