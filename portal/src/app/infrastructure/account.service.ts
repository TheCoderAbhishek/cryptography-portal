import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import axios from 'axios';
import JSEncrypt from 'jsencrypt';
import { from } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Adjust the interface to match your backend API models
interface LoginResponse {
  // Define properties based on the backend's response structure
}

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiUrl = 'https://localhost:44349/api/Account/';

  constructor() {}

  getRsaPublicKey(): Observable<string> {
    return from(axios.get<any>(`${this.apiUrl}GenerateRsaKeyPairAsync`)) // Use 'any' for flexibility
      .pipe(
        map((response) => {
          if (response.data && response.data.returnValue) {
            return response.data.returnValue as string; // Extract and cast to string
          } else {
            throw new Error('Public key not found in API response');
          }
        }),
        catchError((error) => {
          console.error(
            'Error getting RSA public key:',
            error.response ? error.response.data : error.message
          );
          throw error;
        })
      );
  }

  login(credentials: any): Observable<LoginResponse> {
    return new Observable<LoginResponse>((observer) => {
      this.getRsaPublicKey().subscribe(
        (publicKey) => {
          // Encrypt the password using the public key
          const encryptedPassword = this.encryptPassword(
            credentials.userPassword,
            publicKey
          );

          // Replace the plain text password with the encrypted one
          credentials.userPassword = encryptedPassword;

          // Make the login request
          axios
            .post<LoginResponse>(`${this.apiUrl}LoginUserAsync`, credentials)
            .then((response) => {
              observer.next(response.data);
              observer.complete();
            })
            .catch((error) => {
              console.error(
                'Error during login:',
                error.response ? error.response.data : error.message
              );
              observer.error(error);
            });
        },
        (error) => {
          observer.error(error);
        }
      );
    });
  }

  // Method to encrypt the password
  private encryptPassword(password: string, publicKey: string): string {
    const jsEncrypt = new JSEncrypt();
    jsEncrypt.setPublicKey(publicKey);
    const encryptedPassword = jsEncrypt.encrypt(password);

    if (encryptedPassword === false) {
      throw new Error('Password encryption failed');
    }

    return encryptedPassword;
  }
}
