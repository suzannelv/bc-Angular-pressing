import { Component, OnInit, createNgModule } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ClientInfo } from '../../model/clientInfo.interface';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  clientData: ClientInfo | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadClientInfo();
  }

  loadClientInfo() {
    if (this.authService.isLoggedIn()) {
      this.authService.getCurrentUser().subscribe({
        next: (data) => {
          this.clientData = data;
        },
        error: (error) => {
          console.error(error);
        },
      });
    } else {
      console.log("Utilisateur n'est pas connecté");
    }
  }
}
