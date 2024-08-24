import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../../../infrastructure/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = {
        UserEmail: this.loginForm.get('email')?.value,
        UserPassword: this.loginForm.get('password')?.value,
      };

      this.accountService.login(credentials).subscribe(
        (response) => {
          console.log('Login successful:', response);
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          alert("Login Failed!");
          console.error('Login failed:', error);
        }
      );
    }
  }
}
