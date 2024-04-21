import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RegisterService } from '../../services/register.service';
import { ZipCodeInterface } from '../../model/zipCode.interface';
import { ZipCodeService } from '../../services/zip-code.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
})
export class RegistrationComponent implements OnInit {
  zipCodeList: ZipCodeInterface[] = [];
  uniqueCities: string[] = [];
  selectedZipCode: string | undefined;
  selectedCity: string = '';
  selectedCityZipCodes: ZipCodeInterface[] = [];

  constructor(
    private registerService: RegisterService,
    private zipcodeService: ZipCodeService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getZipCodes();
  }

  onCityChange(selectedCity: string) {
    // Filter la ville et son code postal
    this.selectedCityZipCodes = this.zipCodeList?.filter(
      (zipCode) => zipCode.city === selectedCity
    );
    // Définir le code postal par défaut
    this.selectedZipCode = this.selectedCityZipCodes[0]['@id'];
  }

  getZipCodes() {
    this.zipcodeService.getZipCodeAll().subscribe((res) => {
      this.zipCodeList = res['hydra:member'];
      this.uniqueCities = [
        ...new Set(this.zipCodeList.map((zipCode) => zipCode.city)),
      ];
      // définir la ville par défaut
      if (this.uniqueCities.length > 0) {
        this.selectedCity = this.uniqueCities[0];
        this.onCityChange(this.selectedCity);
      }
    });
  }

  onSubmit(form: NgForm) {
    const data = form.value;
    let zipCodeIRI = this.selectedZipCode;
    if (!zipCodeIRI?.startsWith('/api/zip_codes/')) {
      return;
    }
    const dataToSubmit = {
      ...data,
      zipCode: zipCodeIRI,
    };

    if (data.birthday) {
      dataToSubmit.birthday = new Date(data.birthday).toISOString();
    } else {
      // pour garantir que l'objet envoyé au serveur est propre et conforme aux attentes de l'API
      delete dataToSubmit.birthday;
    }

    this.registerService.register(dataToSubmit).subscribe({
      next: (response: any) => {
        const username = response.firstname;
        this.router.navigate(['/welcome', username]);
      },
      error: () =>
        this.notificationService.showError(
          "Une erreur s'est produite lors de l'inscription. Veuillez réessayer plus tard."
        ),
    });
  }
}
