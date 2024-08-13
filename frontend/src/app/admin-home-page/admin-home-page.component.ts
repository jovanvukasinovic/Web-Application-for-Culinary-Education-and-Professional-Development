import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-home-page',
  templateUrl: './admin-home-page.component.html',
  styleUrl: './admin-home-page.component.css',
})
export class AdminHomePageComponent implements OnInit {
  admin: any = null;
  photoUrl: string | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Učitaj podatke o administratoru iz localStorage
    const adminData = localStorage.getItem('admin');
    if (adminData) {
      this.admin = JSON.parse(adminData);

      // Ako postoji slika, formiraj ispravan URL za prikazivanje slike
      if (this.admin.photo && this.admin.photo.data) {
        this.photoUrl = `data:${this.admin.photo.contentType};base64,${this.admin.photo.data}`;
      }
    }
  }

  logout(): void {
    // Ukloni podatke o adminu iz localStorage
    localStorage.removeItem('admin');

    // Preusmeri korisnika na admin login stranicu
    this.router.navigate(['/admin-login']);
  }
}
