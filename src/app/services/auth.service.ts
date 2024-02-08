import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../constants/api-constants';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';
import { TokenInterface } from '../model/token.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private tokenService: TokenService) {}

  login(email: string, password: string): Observable<TokenInterface> {
    return this.http.post<TokenInterface>(`${BASE_URL}login_check`, {
      username: email,
      password: password,
    });
  }

  storeToken(token: string): void {
    this.tokenService.setToken(token);
  }
}
