import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {}

  get form(): FormGroup {
    if (!this._initialized) {
      this._form = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(64)]],
        lastName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(64)]],
        dateOfBirth: ['', Validators.required],
        technology: ['', Validators.required],
        technologyVersion: [{ value: '', disabled: true }, Validators.required],
        email: ['', [Validators.required, Validators.email]],
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
}