import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../services/recipe.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-recipes',
  templateUrl: './my-recipes.component.html',
  styleUrls: ['./my-recipes.component.css'],
})
export class MyRecipesComponent implements OnInit {
  myRecipes: any[] = [];
  currentUser: any;
  hasRecipes: boolean = false;
  isLoading: boolean = true;

  constructor(private recipeService: RecipeService, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (this.currentUser && this.currentUser._id) {
      this.loadMyRecipes();
    } else {
      this.isLoading = false;
    }
  }

  loadMyRecipes(): void {
    this.recipeService.getRecipesByUser(this.currentUser._id).subscribe(
      (recipes) => {
        this.myRecipes = recipes || [];
        this.hasRecipes = this.myRecipes.length > 0;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching my recipes:', error);
        this.isLoading = false;
      }
    );
  }

  viewRecipe(recipe: any): void {
    try {
      const serializedRecipe = JSON.stringify(recipe);
      const sizeInBytes = new Blob([serializedRecipe]).size;

      if (sizeInBytes > 5 * 1024 * 1024) {
        alert('The recipe is too large to be stored. Please try another one.');
        return;
      }

      localStorage.setItem('currentRecipe', serializedRecipe);
      this.router.navigate([`/recipe/${recipe._id}`]);
    } catch (e) {
      console.error('Storage error:', e);
      alert('Unable to store recipe data. Please try again.');
    }
  }

  getImageSrc(image: any): string {
    return `data:${image.contentType};base64,${
      image.data || image.imageBase64
    }`;
  }
}
