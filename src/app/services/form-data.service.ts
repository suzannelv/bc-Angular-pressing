import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormDataInterface } from '../model/FormData.interface';

@Injectable({
  providedIn: 'root',
})
export class FormDataService {
  private formDataSuject = new BehaviorSubject<FormDataInterface>({});
  formData$ = this.formDataSuject.asObservable();

  constructor() {}

  updateFormData(formData: FormDataInterface) {
    this.formDataSuject.next(formData);
  }

  getFormData(): FormDataInterface {
    return this.formDataSuject.value;
  }
}
