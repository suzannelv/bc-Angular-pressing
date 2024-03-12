import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { isDateAfter } from '../../utils/isDateAfter';
import { NgForm } from '@angular/forms';
import { isDateBeforeToday } from '../../utils/isDateBeforeToday';

@Component({
  selector: 'app-click-collect-form',
  templateUrl: './click-collect-form.component.html',
  styleUrl: './click-collect-form.component.css',
})
export class ClickCollectFormComponent implements OnInit {
  @ViewChild('ccForm') myForm!: NgForm;

  formData = {
    depositDate: '',
    retrieveDate: '',
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
    }
  }

  isDepositDateValid(): boolean {
    // Si aucune date n'est choisie, ne pas invalider le champ
    if (!this.formData.depositDate) return true;
    return !isDateBeforeToday(this.formData.depositDate);
  }

  isRetrieveDateValid(): boolean {
    if (this.formData.depositDate && this.formData.retrieveDate) {
      return isDateAfter(this.formData.depositDate, this.formData.retrieveDate);
    }
    return true;
  }

  submitForm() {
    if (this.myForm?.valid && this.isRetrieveDateValid()) {
      return this.formData;
    } else {
      return null;
    }
  }
}
