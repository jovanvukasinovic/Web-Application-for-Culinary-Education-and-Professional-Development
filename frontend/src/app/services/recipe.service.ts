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

  getTop9Recipes(category: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/top9/${category}`);
  }

  getFavouriteRecipes(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/favourites/${userId}`);
  }

  // Pretraga i sortiranje recepata
  sortRecipes(sortBy: string, order: string): Observable<any[]> {
    let params = new HttpParams().set('sortBy', sortBy).set('order', order);

    return this.http.get<any[]>(`${this.apiUrl}/sort`, { params });
  }

  // Funkcija za dohvatanje recepta po ID-u
  getRecipeById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/recipe/${id}`);
  }

  // Dodavanje komentara i ocene receptu
  addCommentAndRating(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/recipe/comment`, data);
  }

  // Editovanje komentara i ocene recepta
  updateCommentAndRating(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/recipe/edit-comment`, data);
  }

  deleteComment(recipeId: string, commentId: string): Observable<any> {
    const data = { recipeId, commentId }; // Spakuj podatke u telo zahteva
    return this.http.delete(`${this.apiUrl}/recipe-delete-comment`, {
      body: data,
    });
  }

  searchRecipes(term: string): Observable<any[]> {
    console.log(term);
    return this.http.get<any[]>(
      `${this.apiUrl}/search?term=${encodeURIComponent(term)}`
    );
  }
}
