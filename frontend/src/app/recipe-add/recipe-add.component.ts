import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeService } from '../services/recipe.service';

enum Tags {
  Vegetarian = 'Vegetarian',
  Vegan = 'Vegan',
  GlutenFree = 'Gluten-Free',
  DairyFree = 'Dairy-Free',
  LowCarb = 'Low-Carb',
  HighProtein = 'High-Protein',
  QuickEasy = 'Quick & Easy',
  KidFriendly = 'Kid-Friendly',
  Spicy = 'Spicy',
  ComfortFood = 'Comfort Food',
  Healthy = 'Healthy',
  LowCalorie = 'Low-Calorie',
  Keto = 'Keto',
  Paleo = 'Paleo',
  Seasonal = 'Seasonal',
  Holiday = 'Holiday',
  BudgetFriendly = 'Budget-Friendly',
  OnePot = 'One-Pot',
  Grilling = 'Grilling',
  Dessert = 'Dessert',
}

enum Categories {
  Appetizers = 'Appetizers',
  MainCourse = 'Main Course',
  SideDish = 'Side Dish',
  Desserts = 'Desserts',
  Soups = 'Soups',
  Salads = 'Salads',
  Beverages = 'Beverages',
  Breakfast = 'Breakfast',
  Brunch = 'Brunch',
  Lunch = 'Lunch',
  Dinner = 'Dinner',
  Snacks = 'Snacks',
  Baking = 'Baking',
  SaucesDips = 'Sauces & Dips',
  Pasta = 'Pasta',
  Pizza = 'Pizza',
  GrillingBBQ = 'Grilling & BBQ',
  Casseroles = 'Casseroles',
  Seafood = 'Seafood',
  Vegetarian = 'Vegetarian',
}

@Component({
  selector: 'app-recipe-add',
  templateUrl: './recipe-add.component.html',
  styleUrls: ['./recipe-add.component.css'],
})
export class RecipeAddComponent {
  name: string = '';
  category: string[] = [];
  description: string = '';
  ingredients: { name: string; quantity: number; unit?: string }[] = [];
  tags: string[] = [];
  image: File | null = null;

  categories = Object.values(Categories);
  tagsList = Object.values(Tags);

  constructor(private recipeService: RecipeService, private router: Router) {}

  addIngredient() {
    this.ingredients.push({ name: '', quantity: 0, unit: '' });
  }

  removeIngredient(index: number) {
    this.ingredients.splice(index, 1);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.image = file;
    }
  }

  onSubmit() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    if (!currentUser || !currentUser._id) {
      console.error('User not found in local storage');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('category', this.category.join(','));
    formData.append('description', this.description);
    formData.append('ingredients', JSON.stringify(this.ingredients));
    formData.append('tags', this.tags.join(','));
    formData.append('createdBy', currentUser._id);

    if (this.image) {
      formData.append('image', this.image);
    }

    this.recipeService.addRecipe(formData).subscribe(
      (response: any) => {
        console.log('Recipe added successfully', response);
        this.router.navigate(['/profile']);
      },
      (error: any) => {
        console.error('Failed to add recipe', error);
      }
    );
  }
}
