import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-admin-dashboard-recipes',
  templateUrl: './admin-dashboard-recipes.component.html',
  styleUrls: ['./admin-dashboard-recipes.component.css'],
})
export class AdminDashboardRecipesComponent implements OnInit {
  recipes: any[] = [];
  filteredRecipes: any[] = [];
  selectedRecipe: any | null = null;
  isLoading = true;
  error: string | null = null;
  showDeleteModal = false;
  recipeToDelete: string | null = null;

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.fetchRecipes();
  }

  fetchRecipes(): void {
    this.isLoading = true;
    this.recipeService.getAllRecipesByAdmin().subscribe(
      (data) => {
        this.recipes = data;
        this.filteredRecipes = data;
        this.isLoading = false;
      },
      (error) => {
        this.error = 'Failed to load recipes.';
        this.isLoading = false;
      }
    );
  }

  onSearch(event: any): void {
    const query = event.target.value.trim().toLowerCase();
    if (query) {
      this.filteredRecipes = this.recipes.filter(
        (recipe) =>
          recipe.name.toLowerCase().includes(query) ||
          recipe.createdBy.toLowerCase().includes(query)
      );
    } else {
      this.filteredRecipes = this.recipes;
    }
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

  openDeleteModal(recipeId: string): void {
    this.showDeleteModal = true;
    this.recipeToDelete = recipeId;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.recipeToDelete = null;
  }

  confirmDeleteRecipe(): void {
    if (this.recipeToDelete) {
      this.recipeService.deleteRecipeById(this.recipeToDelete).subscribe(
        () => {
          this.recipes = this.recipes.filter(
            (recipe) => recipe._id !== this.recipeToDelete
          );
          this.filteredRecipes = this.filteredRecipes.filter(
            (recipe) => recipe._id !== this.recipeToDelete
          );
          this.closeDeleteModal();
        },
        (error) => {
          this.error = 'Failed to delete recipe.';
          this.closeDeleteModal();
        }
      );
    }
  }
}
