// favourites.component.ts
import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../services/recipe.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css'],
})
export class FavouritesComponent implements OnInit {
  originalRecipes: any[] = []; // Initialize as an empty array
  copyRecipes: any[] = [];
  currentUser: any;
  hasFavourites: boolean = false; // Set to false initially

  constructor(private recipeService: RecipeService, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (this.currentUser && this.currentUser.favouriteRecepies?.length) {
      this.loadFavouriteRecipes();
    }
  }

  loadFavouriteRecipes(): void {
    this.recipeService.getAllRecipes().subscribe(
      (recipes) => {
        this.originalRecipes = recipes || []; // Ensure it's an array
        this.hasFavourites = true;

        const favouriteRecipeIds = this.currentUser.favouriteRecepies.map(
          (id: any) => id.toString()
        );

        this.copyRecipes = this.originalRecipes.filter((recipe: any) =>
          favouriteRecipeIds.includes(recipe._id.toString())
        );

        this.copyRecipes.forEach((copyRecipes) => {
          if (!copyRecipes.averageRating && copyRecipes.ratings?.length) {
            const total = copyRecipes.ratings.reduce(
              (sum: any, rating: any) => sum + rating.rating,
              0
            );
            copyRecipes.averageRating = total / copyRecipes.ratings.length;
          } else if (!copyRecipes.averageRating) {
            copyRecipes.averageRating = 0; // Handle case where there are no ratings
          }
        });

        this.hasFavourites = this.copyRecipes.length > 0;
      },
      (error) => {
        console.error('Error fetching favourite recipes:', error);
        this.hasFavourites = false;
      }
    );
  }

  // viewRecipe(recipe: any): void {
  //   try {
  //     localStorage.setItem('currentRecipe', JSON.stringify(recipe));
  //     this.router.navigate([`/recipe/${recipe._id}`]);
  //   } catch (e) {
  //     console.error('Storage error:', e);
  //     alert('Unable to store recipe data. Please try again.');
  //   }
  // }

  viewRecipe(recipe: any): void {
    try {
      const serializedRecipe = JSON.stringify(recipe);
      const sizeInBytes = new Blob([serializedRecipe]).size;

      console.log(`Size of the recipe object: ${sizeInBytes} B`);

      // Proverite da li je veličina manja od recimo 5MB (5 * 1024 * 1024 bajtova)
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
