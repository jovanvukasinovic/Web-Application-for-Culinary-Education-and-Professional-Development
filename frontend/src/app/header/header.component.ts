import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  role: string = 'guest';
  userId: string | null = null;
  isLoading: boolean = true; // Dodajte isLoading

  constructor(private router: Router) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.loadUserRole();
      this.isLoading = false; // Nakon učitavanja role sakrijte loading indikator
    }, 300); // Odložite za 300ms kako bi se tranzicija sakrila
  }

  loadUserRole(): void {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      this.role = user.role;
      this.userId = user._id;
    } else {
      this.role = 'guest';
    }
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('currentUser') !== null;
  }

  isLoginRoute(): boolean {
    return this.router.url === '/login';
  }

  isProfileRoute(): boolean {
    return this.router.url === '/profile';
  }

  isAdminLoginRoute(): boolean {
    return this.router.url === '/admin-login';
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.role = 'guest';
    this.userId = null;
    this.router.navigate(['/']).then(() => {
      location.reload(); // Automatski osvežava stranicu
    });
  }

  isGuess(): boolean {
    return this.role === 'guest';
  }

  isUser(): boolean {
    return this.role === 'user';
  }

  isChef(): boolean {
    return this.role === 'chef';
  }

  isAdmin(): boolean {
    return this.role === 'admin';
  }

  goHome(): void {
    this.router.navigate(['/']).then(() => {
      location.reload(); // Automatski osvežava stranicu
    });
  }
}
