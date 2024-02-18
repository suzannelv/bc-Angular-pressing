import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RegisterService } from '../../services/register.service';
import { ZipCodeInterface } from '../../model/zipCode.interface';
import { ZipCodeService } from '../../services/zip-code.service';
import { zip } from 'rxjs/operators';
import { Router } from '@angular/router';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getZipCodes();
  }

  onCityChange(selectedCity: string) {
    // filter city and its zipcode
    this.selectedCityZipCodes = this.zipCodeList?.filter(
      (zipCode) => zipCode.city === selectedCity
    );
    // set default zipcode
    this.selectedZipCode = this.selectedCityZipCodes[0]['@id'];
    console.log(this.selectedZipCode);
  }

  getZipCodes() {
    this.zipcodeService.getZipCodeAll().subscribe((res) => {
      this.zipCodeList = res['hydra:member'];
      console.log(this.zipCodeList);
      this.uniqueCities = [
        ...new Set(this.zipCodeList.map((zipCode) => zipCode.city)),
      ];
      // set default city
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
      console.error('Selected ZipCode is not a valid IRI');
      return;
    }
    const dataToSubmit = {
      ...data,
      zipCode: zipCodeIRI,
    };

    if (data.birthday) {
      dataToSubmit.birthday = new Date(data.birthday).toISOString();
    } else {
      delete dataToSubmit.birthday;
    }

    this.registerService.register(dataToSubmit).subscribe({
      next: (response: any) => {
        console.log('Success:', response);
        const username = response.firstname;
        this.router.navigate(['/welcome', username]);
      },
      error: (error) => console.error('Registration error:', error),
    });
  }
}
