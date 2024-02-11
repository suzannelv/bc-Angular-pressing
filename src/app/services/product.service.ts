import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, expand, of, reduce } from 'rxjs';
import { ProductInterface, ProductResponse } from '../model/product.interface';
import { BASE_URL } from '../constants/api-constants';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProductAll(): Observable<any[]> {
    let initialUrl = `${BASE_URL}products`;

    return this.http.get<any>(initialUrl).pipe(
      expand((res) => {
        if (res['hydra:view'] && res['hydra:view']['hydra:next']) {
          return this.http.get<any>(res['hydra:view']['hydra:next']);
        } else {
          return of(null);
        }
      }),
      reduce((acc, cur) => {
        return acc.concat(cur ? cur['hydra:member'] : []);
      }, [])
    );
  }

  getProductById(productId: number): Observable<ProductInterface> {
    return this.http.get<ProductInterface>(`${BASE_URL}products/${productId}`);
  }
}
