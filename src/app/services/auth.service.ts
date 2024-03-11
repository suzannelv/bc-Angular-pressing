import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../constants/api-constants';
import { Observable, catchError, throwError } from 'rxjs';
import { TokenService } from './token.service';
import { TokenInterface } from '../model/token.interface';
import { ClientInfo } from '../model/clientInfo.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {}

  login(email: string, password: string): Observable<TokenInterface> {
    return this.http
      .post<TokenInterface>(`${BASE_URL}login_check`, {
        username: email,
        password: password,
      })
      .pipe(
        catchError(() => {
          return throwError(() => new Error());
        })
      );
  }

  storeToken(token: string): void {
    this.tokenService.setToken(token);
    this.autoLogout(3600000);
  }

  // vérifier si l'utilisateur se connecter à travers l'existance de token
  isLoggedIn(): boolean {
    return this.tokenService.isLogged();
  }

  // se déconnecter et arrêter counter
  logout() {
    this.tokenService.clearToken();
    this.router.navigate(['/auth']);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  // déclancher auto déconnection au bout d'une durée donnée
  autoLogout(expirationDuration: number) {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  // si l'utilisateur est connecter, récupérer ses infos
  getCurrentUser(): Observable<ClientInfo> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.tokenService.getToken(),
      }),
    };
    return this.http.get<ClientInfo>(`${BASE_URL}me`, httpOptions).pipe(
      catchError((error) => {
        console.error('Une erreur survenue:', error);
        return throwError(
          () =>
            new Error('Une erreur est survenue lors de récupérer client info.')
        );
      })
    );
  }
}
