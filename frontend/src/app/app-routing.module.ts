import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';

import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminDashboardUsersComponent } from './admin-dashboard-users/admin-dashboard-users.component';
import { AdminDashboardRecipesComponent } from './admin-dashboard-recipes/admin-dashboard-recipes.component';
import { RecipeAddComponent } from './recipe-add/recipe-add.component';
import { RecipesComponent } from './recipes/recipes.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { Top9RecipesComponent } from './top-9-recipes/top-9-recipes.component';
import { FavouritesComponent } from './favourites/favourites.component';
import { BecomeAChefComponent } from './become-a-chef/become-a-chef.component';
import { MyRecipesComponent } from './my-recipes/my-recipes.component';
import { CandidatesComponent } from './candidates/candidates.component';

const routes: Routes = [
  { path: '', component: RecipesComponent },
  { path: 'recipe/:id', component: RecipeDetailComponent },
  { path: 'top-9-recipes', component: Top9RecipesComponent },

  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  {
    path: 'register',
    component: UserRegistrationComponent,
    canActivate: [AuthGuard],
  },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  {
    path: 'admin-login',
    component: AdminLoginComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin-dashboard-users',
    component: AdminDashboardUsersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin-dashboard-recipes',
    component: AdminDashboardRecipesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'recipe-add',
    component: RecipeAddComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'favourites',
    component: FavouritesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'become-a-chef',
    component: BecomeAChefComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'my-recipes',
    component: MyRecipesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'candidates',
    component: CandidatesComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
