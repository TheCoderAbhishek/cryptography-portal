import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginService } from './services/login-service.service';
import { NgClass, NgIf } from '@angular/common';
import { LoaderService } from '../../../../shared/services/loader.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginError: string | null = null;
  isPasswordVisible: boolean = false;
  emailErrorMessage: string | null = null;
  passwordValidation = {
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  };

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.initializeLoginForm();
    this.onPasswordChanges();
    this.onEmailChanges();
  }

  private initializeLoginForm(): void {
    this.loginForm = this.fb.group({
      userEmail: ['', [Validators.required, Validators.email]],
      userPassword: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    this.checkEmailValidity();
    if (this.loginForm.valid) {
      this.loaderService.show();
      const credentials = this.loginForm.value;
      this.loginService.login(credentials).subscribe({
        next: (response) => {
          this.storeToken(response.returnValue.token);
          this.loaderService.hide();
        },
        error: (error) => {
          this.loaderService.hide();
          this.loginError = 'Invalid email or password.';
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }

  onPasswordChanges(): void {
    this.loginForm.get('userPassword')?.valueChanges.subscribe((password) => {
      this.passwordValidation.length =
        password.length >= 8 && password.length <= 20;
      this.passwordValidation.uppercase = /[A-Z]/.test(password);
      this.passwordValidation.lowercase = /[a-z]/.test(password);
      this.passwordValidation.number = /\d/.test(password);
      this.passwordValidation.specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(
        password
      );
    });
  }
  onEmailChanges(): void {
    this.loginForm.get('userEmail')?.valueChanges.subscribe(() => {
      this.checkEmailValidity();
    });
  }

  checkEmailValidity(): void {
    const emailControl = this.loginForm.get('userEmail');
    if (emailControl?.hasError('required')) {
      this.emailErrorMessage = 'empty';
    } else if (emailControl?.hasError('email')) {
      this.emailErrorMessage = 'invalid';
    } else {
      this.emailErrorMessage = null;
    }
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  storeToken(token: string): void {
    sessionStorage.setItem('authToken', token);
  }
  
  getToken(): string | null {
    return sessionStorage.getItem('authToken');
  }
  
  removeToken(): void {
    sessionStorage.removeItem('authToken');
  }
}
