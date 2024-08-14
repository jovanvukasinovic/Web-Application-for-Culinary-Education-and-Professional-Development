import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../services/recipe.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
})
export class RecipesComponent implements OnInit {
  recipes: any[] = [];
  originalRecipes: any[] = []; // Originalni podaci sa servera, uključujući slike
  sortBy: string = ''; // Trenutni kriterijum sortiranja
  order: string = 'asc'; // Trenutni redosled sortiranja, podrazumevano uzlazno

  constructor(private recipeService: RecipeService, private router: Router) {}

  ngOnInit(): void {
    this.getAllRecipes();
  }

  getAllRecipes(): void {
    // Ako već imamo recepte, ne dohvataj ponovo sa servera
    if (this.originalRecipes.length > 0) {
      this.recipes = [...this.originalRecipes];
      return;
    }

    this.recipeService.getAllRecipes().subscribe(
      (data) => {
        this.originalRecipes = data;
        this.recipes = [...data];
      },
      (error) => {
        console.error('Error fetching recipes:', error);
      }
    );
  }

  sortRecipes(sortBy: string): void {
    // Ako je kliknuto isto dugme, promeni redosled sortiranja
    if (this.sortBy === sortBy) {
      this.order = this.order === 'asc' ? 'desc' : 'asc';
    } else {
      // Ako je kliknuto drugo dugme, postavi novi kriterijum sortiranja i podrazumevani redosled
      this.sortBy = sortBy;
      this.order = 'asc';
    }

    this.recipes = this.sortArray(
      this.originalRecipes,
      this.sortBy,
      this.order
    );
  }

  // Funkcija za sortiranje niza recepata
  sortArray(array: any[], sortBy: string, order: string): any[] {
    return array.sort((a, b) => {
      if (order === 'asc') {
        return a[sortBy] > b[sortBy] ? 1 : -1;
      } else {
        return a[sortBy] < b[sortBy] ? 1 : -1;
      }
    });
  }

  // Funkcija za navigaciju na stranicu sa detaljima recepta
  viewRecipe(recipe: any): void {
    // Sačuvaj recept u localStorage
    localStorage.setItem('currentRecipe', JSON.stringify(recipe));
    // Preusmeri na stranicu sa detaljima recepta
    this.router.navigate([`/recipe/${recipe._id}`]);
  }
}
