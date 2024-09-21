import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActiveUsersService } from '../services/active-users.service';
import { LoaderService } from '../../../../../shared/services/loader.service';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [FormsModule, NgIf, NgClass],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css',
})
export class CreateUserComponent {
  user: any;
  confirmPassword: string | null = null;
  emailErrorMessage: string | null = null;
  usernameErrorMessage: string | null = null;
  passwordErrorMessage: string | null = null;
  nameErrorMessage: string | null = null;
  passwordMismatch: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private loaderService: LoaderService,
    private activeUsersService: ActiveUsersService
  ) {
    this.user = {};
  }

  ngOnInit(): void {
    this.user = {
      Name: '',
      UserName: '',
      Email: '',
      Password: '',
      RoleId: null,
    };
  }

  onSubmit(ngForm: NgForm) {
    if (this.user.Password !== this.confirmPassword) {
      this.passwordMismatch = true;
      return;
    }

    if (ngForm.valid) {
      this.loaderService.show();
      this.activeUsersService.createNewUser(this.user).subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.responseCode === 1) {
            alert(response.successMessage);
            this.navigateToActiveUsers();
          } else if (response.responseCode === 2) {
            // Duplicate email error
            this.emailErrorMessage = response.errorMessage;
            this.clearErrorMessage('email');
          } else if (response.responseCode === 3) {
            // Duplicate username error
            this.usernameErrorMessage = response.errorMessage;
            this.clearErrorMessage('username');
          } else {
            alert(response.errorMessage);
          }
          this.loaderService.hide();
        },
        error: (error: any) => {
          console.error('Error while creating user:', error);
        },
      });
    } else {
      console.error(
        'Invalid create user form submitted. Please check for errors.'
      );
    }
  }

  // Real-time validation for Name (only alphabets)
  validateName() {
    const namePattern = /^[a-zA-Z\s]+$/;
    if (!namePattern.test(this.user.Name)) {
      this.nameErrorMessage = 'Name can only contain alphabets and spaces.';
    } else {
      this.nameErrorMessage = null;
    }
  }

  // Real-time validation for Email
  validateEmail() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(this.user.Email)) {
      this.emailErrorMessage = 'Please enter a valid email address.';
    } else {
      this.emailErrorMessage = null;
    }
  }

  // Real-time validation for Username (no special symbols or spaces)
  validateUsername() {
    const usernamePattern = /^[a-zA-Z0-9_]+$/;
    if (!usernamePattern.test(this.user.UserName)) {
      this.usernameErrorMessage =
        'Username cannot contain special symbols or spaces.';
    } else {
      this.usernameErrorMessage = null;
    }
  }

  // Real-time password validation (must include uppercase, lowercase, number, and special symbol)
  validatePassword() {
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/;
    if (!passwordPattern.test(this.user.Password)) {
      this.passwordErrorMessage =
        'Password must be at least 6 characters and include uppercase, lowercase, number, and special symbol.';
    } else {
      this.passwordErrorMessage = null;
    }
  }

  // Real-time validation for password match
  validatePasswordMatch() {
    this.passwordMismatch = this.user.Password !== this.confirmPassword;
  }

  navigateToActiveUsers() {
    this.activeUsersService.handleCreateNewUserSuccess();
  }

  // Toggle password visibility for password field
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Toggle password visibility for confirm password field
  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // Clear error messages after 3 seconds
  clearErrorMessage(field: string) {
    setTimeout(() => {
      if (field === 'email') {
        this.emailErrorMessage = null;
      } else if (field === 'username') {
        this.usernameErrorMessage = null;
      }
    }, 5000);
  }
}
