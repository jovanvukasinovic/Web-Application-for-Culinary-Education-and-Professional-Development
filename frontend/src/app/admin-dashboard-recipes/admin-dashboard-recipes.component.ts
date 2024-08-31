import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-admin-dashboard-recipes',
  templateUrl: './admin-dashboard-recipes.component.html',
  styleUrls: ['./admin-dashboard-recipes.component.css'],
})
export class AdminDashboardRecipesComponent implements OnInit {
  recipes: any[] = [];
  selectedRecipe: any | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.fetchRecipes();
  }

  fetchRecipes(): void {
    this.isLoading = true;
    this.recipeService.getAllRecipes().subscribe(
      (data) => {
        this.recipes = data;
        this.isLoading = false;
      },
      (error) => {
        this.error = 'Failed to load recipes.';
        this.isLoading = false;
      }
    );
  }

  toggleRecipeStatus(recipeId: string, status: string): void {
    this.recipeService.updateRecipeStatus(recipeId, status).subscribe(
      (updatedRecipe) => {
        const index = this.recipes.findIndex(
          (recipe) => recipe._id === recipeId
        );
        if (index !== -1) {
          this.recipes[index].status = status;
        }
      },
      (error) => {
        this.error = `Failed to update recipe status to ${status}.`;
      }
    );
  }

  deleteRecipe(recipeId: string): void {
    if (confirm('Are you sure you want to delete this recipe?')) {
      this.recipeService.deleteRecipe(recipeId).subscribe(
        () => {
          this.recipes = this.recipes.filter(
            (recipe) => recipe._id !== recipeId
          );
          this.selectedRecipe = null;
        },
        (error) => {
          this.error = 'Failed to delete recipe.';
        }
      );
    }
  }

  clearSelection(): void {
    this.selectedRecipe = null;
  }
}
