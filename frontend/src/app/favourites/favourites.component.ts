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
  favouriteRecipes: any[] = [];
  currentUser: any;
  hasFavourites: boolean = true;
  isLoading: boolean = true;

  constructor(private recipeService: RecipeService, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (this.currentUser && this.currentUser.favouriteRecepies?.length) {
      setTimeout(() => {
        this.loadFavouriteRecipes();
      }, 300);
    } else {
      this.isLoading = false;
      this.hasFavourites = false;
    }
  }

  loadFavouriteRecipes(): void {
    this.recipeService.getFavouriteRecipes(this.currentUser._id).subscribe(
      (recipes) => {
        this.favouriteRecipes = recipes || [];

        this.favouriteRecipes.forEach((favouriteRecipes) => {
          if (
            !favouriteRecipes.averageRating &&
            favouriteRecipes.ratings?.length
          ) {
            const total = favouriteRecipes.ratings.reduce(
              (sum: any, rating: any) => sum + rating.rating,
              0
            );
            favouriteRecipes.averageRating =
              total / favouriteRecipes.ratings.length;
          } else if (!favouriteRecipes.averageRating) {
            favouriteRecipes.averageRating = 0;
          }
        });

        this.hasFavourites = this.favouriteRecipes.length > 0;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching favourite recipes:', error);
        this.isLoading = false;
        this.hasFavourites = false;
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
