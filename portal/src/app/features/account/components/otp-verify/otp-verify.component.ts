import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoaderService } from '../../../../shared/services/loader.service';
import { ActivatedRoute } from '@angular/router';
import { NgIf } from '@angular/common';
import { OtpVerifyService } from './services/otp-verify.service';

@Component({
  selector: 'app-otp-verify',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './otp-verify.component.html',
  styleUrl: './otp-verify.component.css',
})
export class OtpVerifyComponent implements OnInit {
  otpForm: FormGroup;
  email: string = '';
  otpErrorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private otpVerifyService: OtpVerifyService
  ) {
    this.otpForm = this.fb.group({
      email: [{ value: '', disabled: true }, Validators.required],
      otp: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    // Get the Base64 encoded email from query params
    const encodedEmail = this.route.snapshot.queryParams['email'];
    // Decode the Base64 encoded email
    if (encodedEmail) {
      this.email = atob(encodedEmail);

      // Set the email in the form
      this.otpForm.patchValue({ email: this.email });
    }
    this.otpForm.patchValue({ email: this.email });

    this.onOtpChanges();
  }

  // Method to handle OTP validation logic
  onOtpChanges(): void {
    this.otpForm.get('otp')?.valueChanges.subscribe(() => {
      this.checkOtpValidity();
    });
  }

  checkOtpValidity(): void {
    const otpControl = this.otpForm.get('otp');
    if (otpControl?.hasError('required')) {
      this.otpErrorMessage = 'empty';
    } else if (otpControl?.value.length < 6) {
      this.otpErrorMessage = 'invalid';
    } else {
      this.otpErrorMessage = '';
    }
  }

  onSubmit() {
    this.checkOtpValidity();
    if (this.otpForm.invalid) {
      return;
    }
    this.loaderService.show();
    const otpVerifyDto = {
      email: this.email,
      otp: this.otpForm.value.otp,
    };
    console.log(otpVerifyDto);
    this.otpVerifyService.otpVerify(otpVerifyDto).subscribe({
      next: (response) => {
        if (response.status === 0) {
          this.loaderService.hide();
          alert(response.successMessage);
          console.log(response);
        } else {
          this.loaderService.hide();
          alert(response.errorMessage);
          console.log(response);
        }
      },
      error: (error) => {
        this.loaderService.hide();
        console.log(error);
      },
    });
  }
}
