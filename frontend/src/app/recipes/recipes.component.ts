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
  currentPage: number = 1; // Trenutna stranica
  recipesPerPage: number = 9; // Broj recepata po stranici
  totalPages: number = 1; // Ukupan broj stranica
  sortBy: string = ''; // Trenutni kriterijum sortiranja
  order: string = 'asc'; // Trenutni redosled sortiranja, podrazumevano uzlazno

  constructor(private recipeService: RecipeService, private router: Router) {}
  ngOnInit(): void {
    this.getAllRecipes();
  }

  getAllRecipes(): void {
    this.recipeService.getAllRecipes().subscribe(
      (data) => {
        this.originalRecipes = data;
        this.totalPages = Math.ceil(
          this.originalRecipes.length / this.recipesPerPage
        );
        this.setPage(this.currentPage);
      },
      (error) => {
        console.error('Error fetching recipes:', error);
      }
    );
  }

  setPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;

    this.currentPage = page;
    const startIndex = (this.currentPage - 1) * this.recipesPerPage;
    const endIndex = startIndex + this.recipesPerPage;
    this.recipes = this.originalRecipes.slice(startIndex, endIndex);
  }

  sortRecipes(sortBy: string): void {
    if (this.sortBy === sortBy) {
      this.order = this.order === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = sortBy;
      this.order = 'asc';
    }

    this.recipes = this.sortArray(
      this.originalRecipes,
      this.sortBy,
      this.order
    );
    this.setPage(1); // Resetuj na prvu stranicu nakon sortiranja
  }

  sortArray(array: any[], sortBy: string, order: string): any[] {
    return array.sort((a, b) => {
      if (order === 'asc') {
        return a[sortBy] > b[sortBy] ? 1 : -1;
      } else {
        return a[sortBy] < b[sortBy] ? 1 : -1;
      }
    });
  }

  viewRecipe(recipe: any): void {
    localStorage.setItem('currentRecipe', JSON.stringify(recipe));
    this.router.navigate([`/recipe/${recipe._id}`]);
  }

  getPaginationArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
