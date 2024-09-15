import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../services/recipe.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.css'],
})
export class CandidatesComponent implements OnInit {
  candidates: any[] = [];
  ratedOrCommentedRecipes: string[] = []; // Čuva ID-eve recepata koje je korisnik ocenio ili komentarisao
  currentUser: any;

  constructor(private router: Router, private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')!);
    this.loadCandidates();
    this.loadRatedOrCommentedRecipes();
  }

  loadCandidates() {
    this.recipeService.getAllRecipesByChef().subscribe((recipes: any[]) => {
      // Grupisanje recepata po korisnicima
      let groupedCandidates = this.groupByUser(recipes);

      // Filtriramo samo korisnike čiji je role === 'user'
      this.candidates = groupedCandidates.filter(
        (candidate: any) => candidate.role === 'user'
      );
    });
  }

  getCategoryDisplay(categories: string[]): string {
    if (categories.length > 3) {
      return categories.slice(0, 3).join(', ') + ', ...';
    } else {
      return categories.join(', ');
    }
  }

  getTagsDisplay(tags: string[]): string {
    if (tags.length > 3) {
      return tags.slice(0, 4).join(', ') + ', ...';
    } else {
      return tags.join(', ');
    }
  }

  loadRatedOrCommentedRecipes() {
    this.recipeService
      .getRecipesRatedOrCommentedByMe(this.currentUser.username)
      .subscribe((recipes: any[]) => {
        this.ratedOrCommentedRecipes = recipes.map((recipe) => recipe._id);
      });
  }

  groupByUser(recipes: any[]) {
    const grouped = recipes.reduce((acc, recipe) => {
      const username = recipe.createdBy;
      if (!acc[username]) {
        acc[username] = { username, recipes: [] };
      }
      acc[username].recipes.push(recipe);
      return acc;
    }, {});

    return Object.values(grouped);
  }

  viewRecipe(recipe: any): void {
    localStorage.setItem('currentRecipe', JSON.stringify(recipe));
    this.router.navigate([`/recipe/${recipe._id}`]);
  }

  getStarFillPercentage(recipe: any): number {
    return (recipe.averageRating / 5) * 100;
  }

  isRecipeRatedOrCommented(recipeId: string): boolean {
    return this.ratedOrCommentedRecipes.includes(recipeId);
  }

  voteForRecipe(recipeId: string) {
    // Logic to cast a vote
    console.log('Voted for recipe ID:', recipeId);
  }

  hasInactiveUserRecipes(candidate: any): boolean {
    // Check if candidate has any inactive recipes and the candidate is not a chef
    return candidate.recipes.some(
      (recipe: any) => recipe.status === 'inactive' && candidate.role === 'user'
    );
  }
}
