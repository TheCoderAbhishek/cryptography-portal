import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Adjust the interface to match your backend API models
interface LoginResponse {
  // ... properties of the login response from the backend
}

interface RegisterRequest {
  // ... properties for registering a new user
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = 'https://localhost:44349/api/Account/';

  constructor(private http: HttpClient) { }

  login(credentials: any): Observable<LoginResponse> { // Adjust 'any' to match your credentials model
    return this.http.post<LoginResponse>(`${this.apiUrl}/LoginUserAsync`, credentials);
  }

  register(user: RegisterRequest): Observable<any> { 
    return this.http.post<any>(`${this.apiUrl}/register`, user);
  }
}