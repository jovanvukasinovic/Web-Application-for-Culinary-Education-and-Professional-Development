import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:4000/api/users'; // Izmenite ovo prema vašem API URL-u

  constructor(private http: HttpClient) {}

  // Prijava korisnika
  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/userLogin`, {
      username,
      password,
    });
  }

  // Prijava administratora
  adminLogin(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/adminLogin`, {
      username,
      password,
    });
  }

  // Dohvatanje korisnika sa _id
  getUserByIdGet(_id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${_id}`);
  }

  getUserByIdPost(id: string): Observable<any> {
    // POST zahtev ako je GET problematičan
    return this.http.post<any>(`${this.apiUrl}/getUserByIdPost`, { id });
  }

  // Dohvatanje korisnika po korisnickom imenu
  getUserByUsername(username: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/:${username}`);
  }

  // Registracija korisnika
  registerUser(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, formData);
  }

  // Dodavanje korisnika od strane administratora
  addUserByAdmin(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addUserByAdmin`, formData);
  }

  // Promena lozinke
  changePassword(
    username: string,
    oldPassword: string,
    newPassword: string
  ): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/changePassword`, {
      username,
      oldPassword,
      newPassword,
    });
  }

  // Verifikacija lozinke korisnika
  verifyPassword(username: string, password: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/verifyPassword`, {
      username,
      password,
    });
  }

  // Aktivacija korisnika od strane administratora
  activateUser(username: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/activateUser`, { username });
  }

  // Deaktivacija korisnika od strane administratora
  deactivateUser(username: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/deactivateUser`, { username });
  }

  // Brisanje korisnika od strane administratora
  deleteUser(username: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/deleteUser`, {
      body: { username },
    });
  }

  // Provera dostupnosti korisničkog imena
  checkUsername(username: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/checkUsername`, { username });
  }

  // Provera dostupnosti email adrese
  checkEmail(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/checkEmail`, { email });
  }

  // Upload profilne slike
  uploadProfilePicture(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/uploadProfilePicture`, formData);
  }

  // Dohvatanje profilne slike korisnika
  getProfilePicture(userId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/profile-picture/${userId}`, {
      responseType: 'blob',
    });
  }

  toggleFavouriteRecipe(userId: string, recipeId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/toggle-favourite`, {
      userId,
      recipeId,
    });
  }
}
