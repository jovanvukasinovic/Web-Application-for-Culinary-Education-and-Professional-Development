import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private apiUrl = 'http://localhost:4000/api/recipes'; // API URL

  constructor(private http: HttpClient) {}

  // Dodavanje novog recepta
  addRecipe(formData: FormData): Observable<any> {
    console.log('name:' + formData.get('name'));
    console.log('category:' + formData.get('category'));
    console.log('description:' + formData.get('description'));
    console.log('ingredients:' + formData.get('ingredients'));
    console.log('tags:' + formData.get('tags'));
    console.log('createdBy:' + formData.get('createdBy'));
    console.log('image:' + formData.get('image'));
    return this.http.post<any>(`${this.apiUrl}/add`, formData);
  }
}
