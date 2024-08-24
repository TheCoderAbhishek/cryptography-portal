import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../../../infrastructure/account.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Updated form controls to match the backend DTO
    this.loginForm = this.fb.group({
      userEmail: ['', [Validators.required, Validators.email]], // Changed 'email' to 'userEmail'
      userPassword: ['', [Validators.required]], // Changed 'password' to 'userPassword'
    });
  }

  onSubmit() {
    console.log(this.loginForm.value);

    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;

      this.accountService.login(credentials).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.loginError = 'Invalid email or password.';
          console.error('Login failed:', error);
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
