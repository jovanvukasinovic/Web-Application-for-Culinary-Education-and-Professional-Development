import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  // Kandidovanje za Chef-a
  addMultipleRecipes(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add-multiple`, formData);
  }

  // Dohvatanje svih recepata koji su aktivni
  getAllRecipes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  // Dohvatanje svih recepata koji su aktivni i neaktivni
  getAllRecipesByAdmin(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/allRecipes`);
  }

  // Dohvatanje svih recepata koji su neaktivni
  getAllRecipesByChef(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/allCandidatesRecipes`);
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

  deleteComment(data: any): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: data, // Ovde se postavlja telo zahteva
    };

    return this.http.delete(`${this.apiUrl}/recipe/delete-comment`, options);
  }

  searchRecipes(term: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/search?term=${encodeURIComponent(term)}`
    );
  }

  // Dohvatanje recepata po korisniku
  getRecipesByUser(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-recipes/${userId}`);
  }

  // Update recipe status
  updateRecipeStatus(recipeId: string, status: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/update-status/${recipeId}`, {
      status,
    });
  }

  // Delete recipe by ID
  deleteRecipeById(recipeId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/delete-recipe`, {
      body: { recipeId },
    });
  }

  // Chef has already voted
  getRecipesRatedOrCommentedByMe(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-voting/${username}`);
  }
}
