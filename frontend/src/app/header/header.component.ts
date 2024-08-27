import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../services/search.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  role: string = 'guest';
  userId: string | null = null;
  isLoading: boolean = true;
  searchTerm: string = ''; // Search term

  constructor(private router: Router, private searchService: SearchService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.loadUserRole();
      this.isLoading = false;
    }, 300);
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

  isHomeRoute(): boolean {
    return this.router.url === '/';
  }

  // Ova metoda se poziva kada se unese tekst u search bar
  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.searchService.setSearchTerm(this.searchTerm); // Šalje termin za pretragu u SearchService
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
      location.reload();
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
      location.reload();
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchService.setSearchTerm(this.searchTerm);
    this.router.navigate(['/']).then(() => {
      location.reload();
    });
  }
}
