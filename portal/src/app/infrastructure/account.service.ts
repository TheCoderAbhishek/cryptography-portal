import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import axios from 'axios';

// Adjust the interface to match your backend API models
interface LoginResponse {
  // Define properties based on the backend's response structure
}

interface RegisterRequest {
  // Define properties for registering a new user
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
        .post<LoginResponse>(`${this.apiUrl}LoginUserAsync`, credentials)
        .then((response) => {
          observer.next(response.data); // Pass the data to the observer
          observer.complete(); // Complete the observable
        })
        .catch((error) => {
          console.error(
            'Error during login:',
            error.response ? error.response.data : error.message
          ); // Improved error logging
          observer.error(error); // Pass the error to the observer
        });
    });
  }

  register(user: RegisterRequest): Observable<any> {
    // Using Axios for the registration request
    return new Observable<any>((observer) => {
      axios
        .post<any>(`${this.apiUrl}register`, user)
        .then((response) => {
          observer.next(response.data); // Pass the data to the observer
          observer.complete(); // Complete the observable
        })
        .catch((error) => {
          console.error(
            'Error during registration:',
            error.response ? error.response.data : error.message
          ); // Improved error logging
          observer.error(error); // Pass the error to the observer
        });
    });
  }
}
