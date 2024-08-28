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

  showAllCategories: boolean = false;
  showAllTags: boolean = false;

  constructor(private recipeService: RecipeService, private router: Router) {}

  toggleSelection(item: string, type: 'category' | 'tags') {
    if (type === 'category') {
      const index = this.category.indexOf(item);
      if (index > -1) {
        this.category.splice(index, 1);
      } else {
        this.category.push(item);
      }
    } else if (type === 'tags') {
      const index = this.tags.indexOf(item);
      if (index > -1) {
        this.tags.splice(index, 1);
      } else {
        this.tags.push(item);
      }
    }
  }

  getVisibleCategories() {
    return this.showAllCategories
      ? this.categories
      : this.categories.slice(0, 10);
  }

  getVisibleTags() {
    return this.showAllTags ? this.tagsList : this.tagsList.slice(0, 10);
  }

  toggleCategoryExpand() {
    this.showAllCategories = !this.showAllCategories;
  }

  toggleTagsExpand() {
    this.showAllTags = !this.showAllTags;
  }

  addIngredient() {
    const lastIngredient = this.ingredients[this.ingredients.length - 1];

    if (
      lastIngredient &&
      (!lastIngredient.name ||
        lastIngredient.quantity <= 0 ||
        !lastIngredient.unit)
    ) {
      return;
    }

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
        this.router.navigate(['/recipes']);
      },
      (error: any) => {
        console.error('Failed to add recipe', error);
      }
    );
  }

  validateNumericInput(event: any) {
    const input = event.target;
    input.value = input.value.replace(/^0+(?!$)/, '');
  }
}
