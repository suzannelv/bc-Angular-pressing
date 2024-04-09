import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import {
  OptionsResponse,
  ServiceOptionsInterface,
} from '../model/serviceOptions.interface';
import { BASE_URL } from '../constants/api-constants';

@Injectable({
  providedIn: 'root',
})
export class ServiceOptionsService {
  private serviceOptionsCache: ServiceOptionsInterface[] | null = null;

  constructor(private http: HttpClient) {}

  getServiceOptions(): Observable<ServiceOptionsInterface[]> {
    if (this.serviceOptionsCache) {
      // s'il y a déja des options de services, retourne ces services options
      return of(this.serviceOptionsCache);
    }
    // récupérer les options depuis le serveur
    return this.http.get<OptionsResponse>(`${BASE_URL}service_options`).pipe(
      tap((response) => (this.serviceOptionsCache = response['hydra:member'])),
      map((response) => response['hydra:member']),
      catchError(() => {
        return throwError(
          () =>
            new Error(
              'Une erreur survenue lors de la récupération des données des options de service.'
            )
        );
      })
    );
  }

  getServiceOptionById(
    id: string
  ): Observable<ServiceOptionsInterface | undefined> {
    if (this.serviceOptionsCache) {
      const option = this.serviceOptionsCache.find(
        (option) => option['@id'] === id
      );
      return of(option);
    }

    return this.getServiceOptions().pipe(
      map((options) => options.find((option) => option['@id'] === id))
    );
  }
}
