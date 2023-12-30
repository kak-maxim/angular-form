import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, AbstractControl,Validators, ValidatorFn,AsyncValidatorFn  } from '@angular/forms';
import { FormService } from './services/user.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type Technology = 'angular' | 'react' | 'vue';
type TechnologyVersions = { [key in Technology]: string[] };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private _form!: FormGroup;
  private _initialized = false;

  technologyVersions: TechnologyVersions = {
    angular: ['1.1.1', '1.2.1', '1.3.3'],
    react: ['2.1.2', '3.2.4', '4.3.1'],
    vue: ['3.3.1', '5.2.1', '5.1.3'],
  };
  currentVersions: string[] = [];

  constructor(private fb: FormBuilder, private formService: FormService) {}

  get form(): FormGroup {
    if (!this._initialized) {
      this._form = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(64)]],
        lastName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(64)]],
        dateOfBirth: ['', [Validators.required, ageValidator(18, 115)]],
        technology: ['', Validators.required],
        technologyVersion: [{ value: '', disabled: true }, Validators.required],
        email: ['', [Validators.required, Validators.email], [this.emailAsyncValidator]],
        hobbies: this.fb.array([this.createHobbyControl()])
      });

      this._form.get('technology')?.valueChanges.subscribe((val: Technology) => {
        this.currentVersions = this.technologyVersions[val] || [];
        this._form.get('technologyVersion')?.reset();
        this._form.get('technologyVersion')?.enable();
      });

      this._initialized = true;
    }
    return this._form;
  }

  get emailAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ emailExists: boolean } | null> => {
      return this.formService.checkEmailExists(control.value)
        .pipe(
          map(users => {
            return (users && users.length > 0) ? { emailExists: true } : null;
          })
        );
    };
  }

  get hobbies(): FormArray {
    return this.form.get('hobbies') as FormArray;
  }

  createHobbyControl(): FormControl {
    return this.fb.control('', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]);
  }

  addHobby() {
    this.hobbies.push(this.createHobbyControl());
  }

  canRemoveHobby(): boolean {
    return this.hobbies.length > 1;
  }

  removeHobby(index: number) {
    if (this.hobbies.length > 1) {
      this.hobbies.removeAt(index);
    }
  }

  private resetForm() {
    this.form.reset();
    // Встановіть початкове значення для масиву хобі
    this.hobbies.clear();
    this.addHobby(); // Додайте одне порожнє поле для хобі
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = {
        firstName: this.form.value.name,
        lastName: this.form.value.lastName,
        dateOfBirth: this.form.value.dateOfBirth,
        framework: this.form.value.technology,
        frameworkVersion: this.form.value.technologyVersion,
        email: this.form.value.email,
        hobbies: this.form.value.hobbies.map((hobby: string) => ({ name: hobby }))
      };

      this.formService.submitFormData(formData).subscribe(
        response => {
          console.log('Form submitted successfully!', response);
          this.resetForm(); 
        },
        error => {
          console.error('Error submitting form:', error);
        }
      );
    }
  }
}

function ageValidator(minAge: number, maxAge: number): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    if (!control.value) {
      return null; // повертаємо null, якщо значення пусте
    }

    const today = new Date();
    const birthDate = new Date(control.value);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return (age >= minAge && age <= maxAge) ? null : { 'ageInvalid': true };
  };


}