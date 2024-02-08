import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductInterface } from '../model/product.interface';
import { BASE_URL } from '../constants/api-constants';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProductAll(options: {
    headers: HttpHeaders;
  }): Observable<ProductInterface[]> {
    return this.http.get<ProductInterface[]>(`${BASE_URL}products`, options);
  }

  getProductById(productId: number): Observable<ProductInterface> {
    return this.http.get<ProductInterface>(`${BASE_URL}/products/${productId}`);
  }
}
