import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
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
    return this.http.get<CategoryResponse>(`${BASE_URL}categories`).pipe(
      catchError(() => {
        return throwError(
          () =>
            new Error(
              'Une erreur survenue lors de la récupération des catégories.'
            )
        );
      })
    );
  }

  getChildCategory(childId: number): Observable<CategoryInterface> {
    if (childId == null || childId <= 0) {
      return throwError(
        () => new Error("ID de sous-catégorie n'est pas pas fournie.")
      );
    }
    return this.http
      .get<CategoryInterface>(`${BASE_URL}categories/${childId}`)
      .pipe(
        catchError(() => {
          return throwError(
            () =>
              new Error(
                'Une erreur survenue lors de la récupération des sous-catégories.'
              )
          );
        })
      );
  }
}
