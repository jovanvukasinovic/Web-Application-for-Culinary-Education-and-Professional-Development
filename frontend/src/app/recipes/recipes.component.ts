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
  currentPage: number = 1;
  recipesPerPage: number = 9;
  totalPages: number = 1;

  constructor(private recipeService: RecipeService, private router: Router) {}

  ngOnInit(): void {
    this.getAllRecipes();
  }

  getAllRecipes(): void {
    this.recipeService.getAllRecipes().subscribe(
      (data) => {
        this.recipes = data;
        this.totalPages = Math.ceil(this.recipes.length / this.recipesPerPage);
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
    this.recipes = this.recipes.slice(startIndex, endIndex);
  }

  viewRecipe(recipe: any): void {
    localStorage.setItem('currentRecipe', JSON.stringify(recipe));
    this.router.navigate([`/recipe/${recipe._id}`]);
  }

  getPaginationArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
