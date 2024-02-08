import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RegisterService } from '../../services/register.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
})
export class RegistrationComponent {
  constructor(private registerService: RegisterService) {}
  onSubmit(form: NgForm) {
    const data = form.value;
    data.birthday = new Date(data.birthday);

    this.registerService.register(data).subscribe((res) => console.log(res));
  }
}
