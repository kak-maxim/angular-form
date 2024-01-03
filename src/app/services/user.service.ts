import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private apiUrlUsers = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  public checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<User[]>(`${this.apiUrlUsers}?email=${email}`)
      .pipe(map(users => users.length > 0));
  }

  submitFormData(formData: User): Observable<object> {
    return this.http.post(`${this.apiUrlUsers}`, formData);
  }
}