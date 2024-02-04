import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Mr.U-Smiley';

  token: string | any = '';

  constructor(private apiService: ApiService) {}

  sendRequest() {
    this.apiService.createCorsToken(this.token);
  }
}
