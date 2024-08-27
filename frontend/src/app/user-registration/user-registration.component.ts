import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.css'],
})
export class UserRegistrationComponent {
  user: any = {
    firstname: '',
    lastname: '',
    username: '',
    password: '',
    email: '',
    phone: '',
  };
  confirmPassword: string = '';
  selectedFile: File | null = null;
  errorMessage: string | null = null;
  passwordError: string | null = null;
  usernameError: string | null = null;
  emailError: string | null = null;

  constructor(private userService: UserService, private router: Router) {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.selectedFile = file;
  }

  validatePassword() {
    const password = this.user.password;
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!regex.test(password)) {
      this.passwordError =
        'Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters.';
    } else {
      this.passwordError = null;
    }
  }

  isPasswordValid(): boolean {
    return (
      !this.passwordError &&
      this.user.password === this.confirmPassword &&
      this.user.password.length > 0
    );
  }

  checkUsernameAvailability() {
    this.userService
      .checkUsername(this.user.username)
      .pipe(debounceTime(300)) // Debounce to prevent multiple requests
      .subscribe(
        (response: any) => {
          this.usernameError =
            response.message === 'Username is taken.'
              ? 'Username is already taken.'
              : null;
        },
        (error) => {
          console.error('Error checking username availability:', error);
        }
      );
  }

  checkEmailAvailability() {
    this.userService
      .checkEmail(this.user.email)
      .pipe(debounceTime(300)) // Debounce to prevent multiple requests
      .subscribe(
        (response: any) => {
          this.emailError =
            response.message === 'E-mail is taken.'
              ? 'Email is already registered.'
              : null;
        },
        (error) => {
          console.error('Error checking email availability:', error);
        }
      );
  }

  async onSubmit() {
    if (!this.selectedFile) {
      this.errorMessage = 'Profile picture is required.';
      return;
    }

    if (this.usernameError || this.emailError || !this.isPasswordValid()) {
      this.errorMessage = 'Please fix the errors before submitting.';
      return;
    }

    const formData = new FormData();
    formData.append('firstname', this.user.firstname);
    formData.append('lastname', this.user.lastname);
    formData.append('username', this.user.username);
    formData.append('password', this.user.password);
    formData.append('email', this.user.email);
    formData.append('phone', this.user.phone);
    formData.append('photo', this.selectedFile);

    try {
      const response = await this.userService
        .registerUser(formData)
        .toPromise();
      this.router.navigate(['/login']); // Redirect after successful registration
    } catch (error: any) {
      if (error.status === 409) {
        // Handle conflict errors from backend
        if (error.error.conflictField === 'username') {
          this.usernameError = 'Username is already taken.';
        } else if (error.error.conflictField === 'email') {
          this.emailError = 'Email is already registered.';
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
      } else {
        console.error('Registration failed:', error);
        this.errorMessage = 'Registration failed. Please try again.';
      }
    }
  }
}
