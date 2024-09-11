import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountService } from '../../../../../infrastructure/account.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class OtpGenerateService {
  constructor(private accountService: AccountService, private router: Router) {}

  // Handle the OTP Generation process
  otpGenerate(otpRequestDto: any): Observable<any> {
    return new Observable((observer) => {
      this.accountService.otpGeneration(otpRequestDto).subscribe({
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

  // Method to handle navigation to OTP Verify Component
  navigateToOtpVerify(email: string): void {
    // Base64 encode the email
    const encodedEmail = btoa(email);

    // Navigate to OTP verify page with Base64 encoded email
    this.router.navigate(['/otp-verify'], {
      queryParams: { email: encodedEmail },
    });
  }

  // Handle OTP Generation success
  private handleOtpGenerateSuccess(response: any): void {
    this.router.navigate(['/otp-verify']);
  }

  // Handle OTP Generation error
  private handleOtpGenerateError(error: any): void {
    console.error('OTP generation failed:', error);
  }
}
