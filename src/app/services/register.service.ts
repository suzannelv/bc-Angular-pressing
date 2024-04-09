import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserInterface } from '../model/user.interface';
import { BASE_URL } from '../constants/api-constants';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private http: HttpClient) {}

  register(userInfo: UserInterface) {
    const body: string = JSON.stringify(userInfo);
    const headers = { 'Content-Type': 'application/json' };

    return this.http.post(`${BASE_URL}clients`, body, { headers: headers });
  }
}
