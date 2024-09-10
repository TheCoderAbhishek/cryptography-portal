import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import axios from 'axios';
import JSEncrypt from 'jsencrypt';
import { from } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environment/environment';

interface LoginResponse {
  token: string;
}

interface RegisterResponse {}

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private apiUrl = `${environment.apiBaseUrl}/Account/`;

  constructor() {}

  getRsaPublicKey(): Observable<string> {
    return from(axios.get<any>(`${this.apiUrl}GenerateRsaKeyPairAsync`)).pipe(
      map((response) => {
        if (response.data && response.data.returnValue) {
          return response.data.returnValue as string;
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

  register(userData: any): Observable<RegisterResponse> {
    return new Observable<RegisterResponse>((observer) => {
      this.getRsaPublicKey().subscribe(
        (publicKey) => {
          // Encrypt the password using the public key
          const encryptedPassword = this.encryptPassword(
            userData.password,
            publicKey
          );

          // Replace the plain text password with the encrypted one
          userData.password = encryptedPassword;

          // Make the login request
          axios
            .post<LoginResponse>(`${this.apiUrl}AddUserAsync`, userData)
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

    if (!encryptedPassword) {
      throw new Error('Password encryption failed');
    }

    return encryptedPassword;
  }
}
