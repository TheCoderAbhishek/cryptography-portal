import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoaderService } from '../../../../shared/services/loader.service';
import { OtpGenerateService } from './services/otp-generate.service';

@Component({
  selector: 'app-otp-generate',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './otp-generate.component.html',
  styleUrl: './otp-generate.component.css',
})
export class OtpGenerateComponent {
  emailForm: FormGroup;
  emailErrorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private otpGenerateService: OtpGenerateService
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit(): void {
    this.onEmailChanges();
  }

  // Method to handle email validation logic
  onEmailChanges(): void {
    this.emailForm.get('email')?.valueChanges.subscribe(() => {
      this.checkEmailValidity();
    });
  }

  checkEmailValidity(): void {
    const emailControl = this.emailForm.get('email');
    if (emailControl?.hasError('required')) {
      this.emailErrorMessage = 'empty';
    } else if (emailControl?.hasError('email')) {
      this.emailErrorMessage = 'invalid';
    } else {
      this.emailErrorMessage = '';
    }
  }

  onSubmit() {
    this.checkEmailValidity();

    if (this.emailForm.invalid) {
      return;
    }

    this.emailErrorMessage = '';
    this.loaderService.show();

    const otpRequestDto = {
      email: this.emailForm.value.email,
      use: 1,
    };

    this.otpGenerateService.otpGenerate(otpRequestDto).subscribe({
      next: (response) => {
        if (response.status === 0) {
          this.loaderService.hide();
          alert(response.successMessage);
          console.log(response);
          this.otpGenerateService.navigateToOtpVerify(this.emailForm.value.email);
        } else {
          this.loaderService.hide();
          alert(response.errorMessage);
          console.log(response);
        }
      },
      error: (error) => {
        this.loaderService.hide();
        this.emailErrorMessage = 'Invalid email or OTP generation error.';
        console.log(error);
      },
    });
  }
}
