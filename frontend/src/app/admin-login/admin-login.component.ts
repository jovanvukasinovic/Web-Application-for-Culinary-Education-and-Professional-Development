import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css',
})
export class AdminLoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string | null = null;

  constructor(private userService: UserService, private router: Router) {}

  login() {
    this.userService.adminLogin(this.username, this.password).subscribe(
      (response) => {
        // Sačuvaj podatke o prijavljenom adminu u localStorage
        localStorage.setItem('admin', JSON.stringify(response));
        this.router.navigate(['/admin-home-page']);
      },
      (error: any) => {
        console.error('Admin login failed', error);
        this.errorMessage = 'Invalid username or password';
      }
    );
  }
}
