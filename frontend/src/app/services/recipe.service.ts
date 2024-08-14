import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private apiUrl = 'http://localhost:4000/api/recipes'; // API URL

  constructor(private http: HttpClient) {}

  // Dodavanje novog recepta
  addRecipe(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, formData);
  }

  // Dohvatanje svih recepata
  getAllRecipes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  // Pretraga i sortiranje recepata
  searchRecipes(sortBy: string, order: string): Observable<any[]> {
    let params = new HttpParams().set('sortBy', sortBy).set('order', order);

    return this.http.get<any[]>(`${this.apiUrl}/search`, { params });
  }

  // Funkcija za dohvatanje recepta po ID-u
  getRecipeById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/recipe/${id}`);
  }
}
