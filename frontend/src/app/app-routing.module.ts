import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';

import { LoginComponent } from './login/login.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { ProfileComponent } from './profile/profile.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { RecipeAddComponent } from './recipe-add/recipe-add.component';
import { RecipesComponent } from './recipes/recipes.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { Top9RecipesComponent } from './top-9-recipes/top-9-recipes.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { BecomeAChefComponent } from './become-a-chef/become-a-chef.component';
import { MyRecipesComponent } from './my-recipes/my-recipes.component';
import { CandidatesComponent } from './candidates/candidates.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

const routes: Routes = [
  { path: '', component: RecipesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: UserRegistrationComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  { path: 'recipe-add', component: RecipeAddComponent },
  { path: 'recipes', component: RecipesComponent },
  { path: 'recipe/:id', component: RecipeDetailComponent },
  { path: 'top-9-recipes', component: Top9RecipesComponent },
  { path: 'favourites', component: FavouritesComponent },
  { path: 'become-a-chef', component: BecomeAChefComponent },
  { path: 'my-recipes', component: MyRecipesComponent },
  { path: 'candidates', component: CandidatesComponent },
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
