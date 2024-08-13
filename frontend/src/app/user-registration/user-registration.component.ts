import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

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
  selectedFile: File | null = null;
  errorMessage: string | null = null;

  constructor(private userService: UserService, private router: Router) {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.selectedFile = file;
  }

  async onSubmit() {
    if (!this.selectedFile) {
      this.errorMessage = 'Profile picture is required.';
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
      this.router.navigate(['/login']); // Nakon uspešne registracije, preusmeri na login stranicu
    } catch (error) {
      console.error('Registration failed:', error);
      this.errorMessage = 'Registration failed. Please try again.';
    }
  }
}
