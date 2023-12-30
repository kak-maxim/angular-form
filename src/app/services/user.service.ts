import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private apiUrl = 'http://localhost:3000'; 
  private apiUrlUsers = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  checkEmailExists(email: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrlUsers}?email=${email}`);
  }

  submitFormData(formData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, formData);
  }
}