import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { RegisterService } from './services/register-service.service';

// Custom validator to check if password and confirmPassword match
function passwordMatchValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {
  const password = control.get('userPassword')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { mismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgIf],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm!: FormGroup;
  isPasswordVisible: boolean = false;
  isConfirmPasswordVisible: boolean = false;
  nameErrorMessage: string | null = null;
  usernameErrorMessage: string | null = null;
  emailErrorMessage: string | null = null;
  passwordErrorMessage: string | null = null;
  confirmPasswordErrorMessage: string | null = null;
  passwordValidation = {
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  };

  constructor(
    private formBuilder: FormBuilder,
    private registerService: RegisterService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group(
      {
        name: ['', Validators.required],
        username: ['', Validators.required],
        userEmail: ['', [Validators.required, Validators.email]],
        userPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(20),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: passwordMatchValidator }
    );
    this.onNameChange();
    this.onUsernameChange();
    this.onEmailChanges();
    this.onPasswordChanges();
  }

  onSubmit(): void {
    this.checkNameValidity();
    this.checkUsernameValidity();
    this.checkEmailValidity();
    this.checkPasswordValidity();
    this.checkConfirmPasswordValidity();

    if (this.registerForm.valid) {
      const userData = {
        name: this.registerForm.value.name,
        username: this.registerForm.value.username,
        email: this.registerForm.value.userEmail,
        password: this.registerForm.value.userPassword,
      };

      this.registerService.register(userData).subscribe({
        next: (response) => {
          console.log('User registered successfully:', response);
        },
        error: (error) => {
          console.error('Registration error:', error);
        },
      });
    }
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
  }

  onNameChange(): void {
    this.registerForm.get('name')?.valueChanges.subscribe(() => {
      this.checkNameValidity();
    });
  }

  checkNameValidity(): void {
    const nameControl = this.registerForm.get('name');
    if (nameControl?.hasError('required')) {
      this.nameErrorMessage = 'empty';
    } else {
      this.nameErrorMessage = null;
    }
  }

  onUsernameChange(): void {
    this.registerForm.get('username')?.valueChanges.subscribe(() => {
      this.checkUsernameValidity();
    });
  }

  checkUsernameValidity(): void {
    const usernameControl = this.registerForm.get('username');
    const usernameValue = usernameControl?.value;
    if (usernameControl?.hasError('required')) {
      this.usernameErrorMessage = 'empty';
    } else if (
      usernameControl?.value &&
      !/^[a-zA-Z0-9]+$/.test(usernameControl.value)
    ) {
      this.usernameErrorMessage = 'invalid';
    } else if (
      usernameValue &&
      (usernameValue.length < 8 || usernameValue.length > 20)
    ) {
      this.usernameErrorMessage = 'length';
    } else {
      this.usernameErrorMessage = null;
    }
  }

  onEmailChanges(): void {
    this.registerForm.get('userEmail')?.valueChanges.subscribe(() => {
      this.checkEmailValidity();
    });
  }

  checkEmailValidity(): void {
    const emailControl = this.registerForm.get('userEmail');
    if (emailControl?.hasError('required')) {
      this.emailErrorMessage = 'empty';
    } else if (emailControl?.hasError('email')) {
      this.emailErrorMessage = 'invalid';
    } else {
      this.emailErrorMessage = null;
    }
  }

  onPasswordChanges(): void {
    this.registerForm.get('userPassword')?.valueChanges.subscribe(() => {
      this.checkPasswordValidity();
    });
  }

  checkPasswordValidity(): void {
    const passwordControl = this.registerForm.get('userPassword');
    const passwordValue = passwordControl?.value;

    this.passwordValidation = {
      length: passwordValue.length >= 8 && passwordValue.length <= 20,
      uppercase: /[A-Z]/.test(passwordValue),
      lowercase: /[a-z]/.test(passwordValue),
      number: /\d/.test(passwordValue),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue),
    };

    if (
      this.passwordValidation.length &&
      this.passwordValidation.uppercase &&
      this.passwordValidation.lowercase &&
      this.passwordValidation.number &&
      this.passwordValidation.specialChar
    ) {
      this.passwordErrorMessage = null;
    } else if (passwordValue === '') {
      this.passwordErrorMessage = 'empty';
    } else {
      this.passwordErrorMessage = 'invalid';
    }
  }

  checkConfirmPasswordValidity(): void {
    const confirmPasswordControl = this.registerForm.get('confirmPassword');

    if (confirmPasswordControl?.hasError('required')) {
      this.confirmPasswordErrorMessage = 'empty';
    } else if (this.registerForm.hasError('mismatch')) {
      this.confirmPasswordErrorMessage = 'mismatch';
    } else {
      this.confirmPasswordErrorMessage = null;
    }
  }
}
