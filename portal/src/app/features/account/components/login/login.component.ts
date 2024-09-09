import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginService } from './services/login-service.service';
import { NgClass } from '@angular/common';
import { LoaderService } from '../../../../shared/services/loader.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginError: string | null = null;
  isPasswordVisible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.initializeLoginForm();
  }

  private initializeLoginForm(): void {
    this.loginForm = this.fb.group({
      userEmail: ['', [Validators.required, Validators.email]],
      userPassword: ['', [Validators.required]],
    });
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loaderService.show();
      const credentials = this.loginForm.value;
      this.loginService.login(credentials).subscribe({
        next: (response) => {
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
}
