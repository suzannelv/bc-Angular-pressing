import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../constants/api-constants';
import { Observable, catchError, throwError } from 'rxjs';
import { MaterialResponse } from '../model/materials.interface';

@Injectable({
  providedIn: 'root',
})
export class MaterialService {
  constructor(private http: HttpClient) {}

  getMaterials(): Observable<MaterialResponse> {
    return this.http.get<MaterialResponse>(`${BASE_URL}materials`).pipe(
      catchError((error) => {
        console.error('An error occurred:', error);
        return throwError(
          () => new Error('An error occurred while fetching the ;materials.')
        );
      })
    );
  }
}
