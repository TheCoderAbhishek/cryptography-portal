import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  confirmPassword: string = '';
  emailErrorMessage: string | null = null;
  usernameErrorMessage: string | null = null;
  passwordMismatch: boolean = false;

  constructor(
    private loaderService: LoaderService,
    private activeUsersService: ActiveUsersService
  ) {
    this.user = {};
  }

  onSubmit() {
    if (this.user.Password !== this.confirmPassword) {
      this.passwordMismatch = true;
      return;
    }

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
  }

  navigateToActiveUsers() {
    this.activeUsersService.handleCreateNewUserSuccess();
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
