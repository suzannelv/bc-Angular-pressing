import { Component, OnInit, createNgModule } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ClientInfo } from '../../model/clientInfo.interface';
import { ClientService } from '../../services/client.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  clientData: ClientInfo | null = null;

  constructor(
    private authService: AuthService,
    private clientService: ClientService
  ) {}

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
  onSubmit(data: NgForm) {
    if (data.valid) {
      const newAddress = data.value.adress;
      const clientId = this.clientData?.id;
      if (clientId) {
        this.clientService.updateClientAddress(clientId, newAddress).subscribe({
          next: (updatedClient) => {
            this.clientData!.adress = updatedClient.adress;
            console.log('Address updated successfully');
            // Do something to reflect changes in the UI, maybe close the modal
          },
          error: (error) => {
            console.error(error);
            // Handle the error state
          },
        });
      }
    }
  }
}
