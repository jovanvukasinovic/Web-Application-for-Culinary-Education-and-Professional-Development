import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../services/recipe.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-become-a-chef',
  templateUrl: './become-a-chef.component.html',
  styleUrls: ['./become-a-chef.component.css'],
})
export class BecomeAChefComponent implements OnInit {
  myRecipes: any[] = [];
  currentUser: any;
  hasRecipes: boolean = false;
  isLoading: boolean = true;
  canAddMoreRecipes: boolean = false;
  isRequirementsMet: boolean = false;
  showChefModal: boolean = false;

  constructor(
    private recipeService: RecipeService,
    private userService: UserService,
    private router: Router
  ) {}

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
        this.canAddMoreRecipes = this.myRecipes.length < 3;
        this.isRequirementsMet = this.checkRequirements();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching my recipes:', error);
        this.isLoading = false;
      }
    );
  }

  checkRequirements(): boolean {
    let isCriteriaMet = true;

    for (const recipe of this.myRecipes) {
      const chefCommentsCount = recipe.comments.length;
      console.log(chefCommentsCount);
      const averageRating = recipe.averageRating;
      console.log(averageRating);

      if (chefCommentsCount < 3 || averageRating < 4.0) {
        isCriteriaMet = false;
        break; // Ako jedan recept ne ispunjava kriterijume, prestajemo sa proverom
      }
    }

    return isCriteriaMet;
  }

  addRecipe(): void {
    this.router.navigate(['/recipe-add']);
  }

  viewRecipe(recipe: any): void {
    localStorage.setItem('currentRecipe', JSON.stringify(recipe));
    this.router.navigate([`/recipe/${recipe._id}`]);
  }

  becomeChef(): void {
    this.userService.becomeChef(this.currentUser.username).subscribe(
      (response) => {
        if (response.success) {
          this.showChefModal = true;
        } else {
          alert('Failed to become a Chef. Please try again.');
        }
      },
      (error) => {
        console.error('Error becoming Chef:', error);
        alert('An error occurred. Please try again later.');
      }
    );
  }

  closeChefModal() {
    this.showChefModal = false;
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']).then(() => {
      location.reload();
    });
  }

  getImageSrc(image: any): string {
    return `data:${image.contentType};base64,${
      image.data || image.imageBase64
    }`;
  }
}
