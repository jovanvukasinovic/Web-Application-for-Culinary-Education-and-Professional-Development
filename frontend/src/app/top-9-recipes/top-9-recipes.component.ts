import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../services/recipe.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-9-recipes',
  templateUrl: './top-9-recipes.component.html',
  styleUrls: ['./top-9-recipes.component.css'],
})
export class Top9RecipesComponent implements OnInit {
  recipes: any[] = [];
  recipesPerPage: number = 9;
  currentCategory: string = 'rating';

  constructor(private recipeService: RecipeService, private router: Router) {}

  ngOnInit(): void {
    this.top9(this.currentCategory);
  }

  top9(category: string): void {
    this.currentCategory = category;
    this.recipeService.getTop9Recipes(category).subscribe(
      (data: any) => {
        this.recipes = data;
      },
      (error: any) => {
        console.error('Error fetching top 9 recipes:', error);
      }
    );
  }

  viewRecipe(recipe: any): void {
    localStorage.setItem('currentRecipe', JSON.stringify(recipe));
    this.router.navigate([`/recipe/${recipe._id}`]);
  }

  getImageSrc(image: any): string {
    return `data:${image.contentType};base64,${
      image.data || image.imageBase64
    }`;
  }
}
