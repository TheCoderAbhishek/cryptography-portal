import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from '../../../../../infrastructure/account.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private accountService: AccountService, private router: Router) {}

  // Handle the login process
  login(credentials: any): Observable<any> {
    return new Observable((observer) => {
      this.accountService.login(credentials).subscribe({
        next: (response) => {
          this.handleLoginSuccess(response);
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          this.handleLoginError(error);
          observer.error(error);
        },
      });
    });
  }

  // Handle login success
  private handleLoginSuccess(response: any): void {
    console.log('Login successful:', response.returnValue.token);
    this.router.navigate(['/dashboard']);
  }

  // Handle login error
  private handleLoginError(error: any): void {
    console.error('Login failed:', error);
  }
}
