import { Injectable } from '@angular/core';
import { AccountService } from '../../../../../infrastructure/account.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private accountService: AccountService, private router: Router) {}

  // Handle the user registration process
  register(userData: any): Observable<any> {
    return new Observable((observer) => {
      this.accountService.register(userData).subscribe({
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
    this.router.navigate(['/login']);
  }

  // Handle login error
  private handleLoginError(error: any): void {
    console.error('Login failed:', error);
  }
}
