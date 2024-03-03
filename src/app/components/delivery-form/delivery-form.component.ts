import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ClientInfo } from '../../model/clientInfo.interface';
import { NgForm } from '@angular/forms';
import { isDateAfter } from '../../utils/isDateAfter';
import { FormDataService } from '../../services/form-data.service';

@Component({
  selector: 'app-delivery-form',
  templateUrl: './delivery-form.component.html',
  styleUrl: './delivery-form.component.css',
})
export class DeliveryFormComponent implements OnInit {
  @ViewChild('deliveryForm') myForm!: NgForm;

  clientInfo = {} as ClientInfo;
  deliveryInfo = {
    depositDate: '',
    retrieveDate: '',
  };
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadClientInfo();
  }

  loadClientInfo() {
    if (this.authService.isLoggedIn()) {
      this.authService.getCurrentUser().subscribe((res) => {
        this.clientInfo = res;
        console.log('client info in cart:', this.clientInfo);
      });
    } else {
      this.clientInfo = {
        firstname: '',
        lastname: '',
        email: '',
        phoneNumber: '',
        adress: '',
        zipCode: {
          zipCode: '',
          city: '',
        },
      };
    }
  }

  // comparer les dates de dépôt et de retrait, la date de retraint ne peut pas avant celle de dépôt
  isDeliveryDateValid(): boolean {
    if (this.deliveryInfo.depositDate && this.deliveryInfo.retrieveDate) {
      return isDateAfter(
        this.deliveryInfo.depositDate,
        this.deliveryInfo.retrieveDate
      );
    }
    return true;
  }

  public getDeliveryInfo() {
    return this.deliveryInfo;
  }

  submitForm() {
    if (this.myForm?.valid && this.isDeliveryDateValid()) {
      return this.myForm.value;
    } else {
      return null;
    }
  }
}
