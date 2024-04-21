import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { BASE_URL } from '../constants/api-constants';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { TokenService } from './token.service';
import { TokenInterface } from '../model/token.interface';
import { ClientInfo } from '../model/clientInfo.interface';
import { Router } from '@angular/router';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenExpirationTimer: any;
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  private cartService!: CartService;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router,
    private injector: Injector
  ) {}

  private hasToken(): boolean {
    // Convertit la valeur récupérée en un booléen vrai ou faux
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
        catchError(() => {
          return throwError(() => new Error('erreur de connextion'));
        })
      );
  }

  storeToken(token: string): void {
    this.tokenService.setToken(token);
    const expirationDuration = 3600000;
    const expirationDate = new Date(new Date().getTime() + expirationDuration);
    localStorage.setItem('expiration', expirationDate.toISOString());
    this.autoLogout(expirationDuration);
  }

  // vérifier si l'utilisateur se connecter à travers l'existance de token
  isLoggedIn(): boolean {
    return this.tokenService.isLogged();
  }

  // se déconnecter et arrêter counter
  logout() {
    this.tokenService.clearToken();
    localStorage.removeItem('userId');
    this.cartService = this.injector.get(CartService);
    this.cartService.clearCart();
    this.loggedIn.next(false);
    this.router.navigate(['/auth']);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  /**
   * Configure automatiquement la déconnexion de l'utilisateur après un délai spécifié.
   * @param expirationDuration Le délai en millisecondes après lequel l'utilisateur sera déconnecté automatiquement.
   */
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
      tap((clientInfo) => {
        if (clientInfo.id !== null) {
          localStorage.setItem('userId', clientInfo.id.toString());
        } else {
          localStorage.removeItem('userId');
        }
      }),
      catchError(() => {
        return throwError(
          () =>
            new Error(
              'Une erreur est survenue lors de récupérer les information du client courant.'
            )
        );
      })
    );
  }
}
