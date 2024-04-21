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

  getMaterialOptions(): Observable<MaterialResponse> {
    return this.http.get<MaterialResponse>(`${BASE_URL}materials`).pipe(
      catchError(() => {
        return throwError(
          () =>
            new Error(
              'Une erreur survenue lors de la récupération des matériels.'
            )
        );
      })
    );
  }
}
