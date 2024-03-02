import { Component, OnInit, Output } from '@angular/core';
import { FormDataService } from '../../services/form-data.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-click-collect-form',
  templateUrl: './click-collect-form.component.html',
  styleUrl: './click-collect-form.component.css',
})
export class ClickCollectFormComponent implements OnInit {
  formData = {
    depositDate: '',
    retrieveDate: '',
  };
  constructor(
    private formDataService: FormDataService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
    }
  }

  onSubmit() {
    this.formDataService.updateFormData(this.formData);
    console.log(this.formData);
  }
}
