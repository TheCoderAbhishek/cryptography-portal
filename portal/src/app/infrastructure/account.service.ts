import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import axios from 'axios';

// Adjust the interface to match your backend API models
interface LoginResponse {
  // ... properties of the login response from the backend
}

interface RegisterRequest {
  // ... properties for registering a new user
}

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiUrl = 'https://localhost:44349/api/Account/';

  constructor() {}

  login(credentials: any): Observable<LoginResponse> {
    // Using Axios for the login request
    return new Observable<LoginResponse>((observer) => {
      axios
        .post<LoginResponse>(`${this.apiUrl}/LoginUserAsync`, credentials)
        .then((response) => {
          observer.next(response.data);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  register(user: RegisterRequest): Observable<any> {
    // Using Axios for the registration request
    return new Observable<any>((observer) => {
      axios
        .post<any>(`${this.apiUrl}/register`, user)
        .then((response) => {
          observer.next(response.data);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
}
