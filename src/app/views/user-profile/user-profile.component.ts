import { Component, OnInit, createNgModule } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ClientInfo } from '../../model/clientInfo.interface';
import { ClientService } from '../../services/client.service';
import { NgForm } from '@angular/forms';
import { OrderDetailInterface } from '../../model/orderDetail.interface';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  clientData: ClientInfo | null = null;
  orderDetails: OrderDetailInterface[] = [];

  constructor(
    private authService: AuthService,
    private clientService: ClientService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadClientInfo();
  }

  loadClientInfo() {
    if (this.authService.isLoggedIn()) {
      this.authService.getCurrentUser().subscribe({
        next: (data) => {
          this.clientData = data;
          console.log(this.clientData);
          this.loadOrderdetails();
        },
        error: () => {
          this.notificationService.showError(
            "Une erreur survenue lors que le téléchargement des données d'un utilisateur "
          );
        },
      });
    }
  }

  loadOrderdetails() {
    const clientId = this.clientData?.id;
    if (clientId) {
      this.clientService.getOrderListByClientId(clientId).subscribe({
        next: (data) => {
          this.orderDetails = data['hydra:member'];
        },
        error: () => {
          this.notificationService.showError(
            'Une erreur survenue lors que le téléchargement des données de la commande.'
          );
        },
      });
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
          },
          error: () => {
            this.notificationService.showError(
              "Une erreur survenue au moment de modifier l'adresse."
            );
          },
        });
      }
    }
  }
}
