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
      // 如果已经有缓存的服务选项，直接返回这些选项
      return of(this.serviceOptionsCache);
    }
    // 从服务器获取服务选项，并缓存结果
    return this.http.get<OptionsResponse>(`${BASE_URL}service_options`).pipe(
      tap((response) => (this.serviceOptionsCache = response['hydra:member'])),
      map((response) => response['hydra:member']),
      catchError((error) => {
        console.error('An error occurred:', error);
        return throwError(() => new Error('Failed to fetch service options.'));
      })
    );
  }

  getServiceOptionById(
    id: string
  ): Observable<ServiceOptionsInterface | undefined> {
    // 如果服务选项已经被缓存，直接从缓存中查找
    if (this.serviceOptionsCache) {
      const option = this.serviceOptionsCache.find(
        (option) => option['@id'] === id
      );
      return of(option);
    }
    // 如果没有缓存，先获取服务选项再查找
    return this.getServiceOptions().pipe(
      map((options) => options.find((option) => option['@id'] === id))
    );
  }

  // getServiceOptions(): Observable<OptionsResponse> {
  //   return this.http.get<OptionsResponse>(`${BASE_URL}service_options`).pipe(
  //     catchError((error) => {
  //       console.error('Une erreur est survenue:', error);
  //       return throwError(
  //         () =>
  //           new Error(
  //             'Une erreur est survenue lorsque récupérer service-options api.'
  //           )
  //       );
  //     })
  //   );
  // }
}
