import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../services/recipe.service';
import { Router } from '@angular/router';
import { SearchService } from '../services/search.service'; // Dodato
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
})
export class RecipesComponent implements OnInit {
  recipes: any[] = [];
  originalRecipes: any[] = [];
  currentPage: number = 1;
  recipesPerPage: number = 9;
  totalPages: number = 1;
  searching = false;
  sortBy: string = '';
  order: string = 'asc';

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private searchService: SearchService // Dodato
  ) {}

  ngOnInit(): void {
    this.searchService
      .getSearchTerm()
      .pipe(
        switchMap((term) => {
          if (term) {
            this.searching = true;
            return this.recipeService.searchRecipes(term); // Pretraga po ključu
          } else {
            return this.recipeService.getAllRecipes(); // Dohvatanje svih recepata ako nema ključa
          }
        })
      )
      .subscribe(
        (data) => {
          this.originalRecipes = data;
          this.totalPages = Math.ceil(
            this.originalRecipes.length / this.recipesPerPage
          );
          this.setPage(this.currentPage);

          this.sortBy = 'rating';
          this.order = 'desc';
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

  sortRecipes(sortBy: string, order: string): void {
    this.recipeService.sortRecipes(sortBy, order).subscribe(
      (recipes) => {
        this.originalRecipes = recipes;
        this.sortBy = sortBy;
        this.order = order;
        this.setPage(this.currentPage);
      },
      (error) => {
        console.error('Error sorting recipes:', error);
      }
    );
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

  // viewRecipe(recipe: any): void {
  //   try {
  //     const serializedRecipe = JSON.stringify(recipe);
  //     const sizeInBytes = new Blob([serializedRecipe]).size;

  //     console.log(`Size of the recipe object: ${sizeInBytes} bytes`);

  //     // Proverite da li je veličina manja od recimo 5MB (5 * 1024 * 1024 bajtova)
  //     if (sizeInBytes > 5 * 1024 * 1024) {
  //       alert('The recipe is too large to be stored. Please try another one.');
  //       return;
  //     }

  //     localStorage.setItem('currentRecipe', serializedRecipe);
  //     this.router.navigate([`/recipe/${recipe._id}`]);
  //   } catch (e) {
  //     console.error('Storage error:', e);
  //     alert('Unable to store recipe data. Please try again.');
  //   }
  // }

  getImageSrc(image: any): string {
    return `data:${image.contentType};base64,${
      image.data || image.imageBase64
    }`;
  }

  getPaginationArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  toggleSort(property: string): void {
    if (this.sortBy === property) {
      // Ako se već sortira po ovoj kategoriji, promeni redosled
      this.order = this.order === 'desc' ? 'asc' : 'desc';
    } else {
      // Ako je izabrana nova kategorija za sortiranje
      this.sortBy = property;
      this.order = 'desc'; // Podrazumevano sortiranje je uzlazno
    }

    this.sortRecipes(this.sortBy, this.order);
  }
}
