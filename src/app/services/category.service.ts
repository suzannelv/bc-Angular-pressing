import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from '../constants/api-constants';
import {
  CategoryInterface,
  CategoryResponse,
} from '../model/category.interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  getParentCategories(): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${BASE_URL}categories`);
  }

  getChildCategory(childId: number): Observable<CategoryInterface> {
    return this.http.get<CategoryInterface>(`${BASE_URL}categories/${childId}`);
  }
}
