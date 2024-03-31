import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../constants/api-constants';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { TokenService } from './token.service';
import { TokenInterface } from '../model/token.interface';
import { ClientInfo } from '../model/clientInfo.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenExpirationTimer: any;
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  login(email: string, password: string): Observable<TokenInterface> {
    return this.http
      .post<TokenInterface>(`${BASE_URL}login_check`, {
        username: email,
        password: password,
      })
      .pipe(
        tap((response) => {
          this.storeToken(response.token);
          this.loggedIn.next(true);
        }),
        catchError((error) => {
          console.error('Login failed:', error);
          return throwError(() => new Error('Login failed'));
        })
      );
  }

  storeToken(token: string): void {
    this.tokenService.setToken(token);
    const expirationDate = new Date(new Date().getTime() + 3600000);
    localStorage.setItem('expiration', expirationDate.toISOString());
    this.autoLogout(3600000);
  }

  // vérifier si l'utilisateur se connecter à travers l'existance de token
  isLoggedIn(): boolean {
    return this.tokenService.isLogged();
  }

  // se déconnecter et arrêter counter
  logout() {
    console.log('Logging out...');
    this.tokenService.clearToken();
    this.loggedIn.next(false);
    this.router.navigate(['/auth']);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  // déclancher auto déconnection au bout d'une durée donnée
  // autoLogout(expirationDuration: number) {
  //   if (this.tokenExpirationTimer) {
  //     clearTimeout(this.tokenExpirationTimer);
  //   }
  //   this.tokenExpirationTimer = setTimeout(() => {
  //     this.logout();
  //   }, expirationDuration);
  // }
  autoLogout(expirationDuration: number) {
    const expirationDateString = localStorage.getItem('expiration');
    if (!expirationDateString) {
      return;
    }
    const expirationDate = new Date(expirationDateString);
    const now = new Date();
    const timeToLogout = expirationDate.getTime() - now.getTime();
    if (timeToLogout <= 0) {
      this.logout();
    } else {
      if (this.tokenExpirationTimer) {
        clearTimeout(this.tokenExpirationTimer);
      }
      this.tokenExpirationTimer = setTimeout(() => {
        this.logout();
      }, timeToLogout);
    }
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
