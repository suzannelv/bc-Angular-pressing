import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'Mr.U-Smiley';

  token: string | any = '';

  constructor(private apiService: ApiService) {}

  sendRequest() {
    this.apiService.createCorsToken(this.token);
  }

  ngOnInit(): void {
    // 处理token逻辑，如果token 存在，存储当地，如果不存在，什么都不做
  }
}
