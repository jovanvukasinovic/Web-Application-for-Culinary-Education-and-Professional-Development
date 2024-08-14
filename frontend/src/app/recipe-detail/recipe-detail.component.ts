import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipe: any;
  ngOnInit(): void {
    this.recipe = JSON.parse(localStorage.getItem('currentRecipe')!);
  }
}
