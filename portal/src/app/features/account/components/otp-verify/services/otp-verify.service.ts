import { Injectable } from '@angular/core';
import { AccountService } from '../../../../../infrastructure/account.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OtpVerifyService {
  constructor(private accountService: AccountService, private router: Router) {}

  // Handle the OTP Generation process
  otpVerify(otpVerifyRequestDto: any): Observable<any> {
    return new Observable((observer) => {
      this.accountService.otpVerify(otpVerifyRequestDto).subscribe({
        next: (response) => {
          this.handleOtpGenerateSuccess(response);
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          this.handleOtpGenerateError(error);
          observer.error(error);
        },
      });
    });
  }

  // Handle OTP Generation success
  private handleOtpGenerateSuccess(response: any): void {
    this.router.navigate(['/login']);
  }

  // Handle OTP Generation error
  private handleOtpGenerateError(error: any): void {
    console.error('OTP generation failed:', error);
  }
}
