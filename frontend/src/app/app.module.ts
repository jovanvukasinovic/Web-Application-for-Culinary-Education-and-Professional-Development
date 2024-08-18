// Imports
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// Providers
import { AuthGuard } from './guards/auth.guard';
import { UserService } from './services/user.service';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { ProfileComponent } from './profile/profile.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { RecipeAddComponent } from './recipe-add/recipe-add.component';
import { RecipesComponent } from './recipes/recipes.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { Top9RecipesComponent } from './top-9-recipes/top-9-recipes.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { BecomeAChefComponent } from './become-a-chef/become-a-chef.component';
import { MyRecipesComponent } from './my-recipes/my-recipes.component';
import { CandidatesComponent } from './candidates/candidates.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminLoginComponent,
    ProfileComponent,
    UserRegistrationComponent,
    RecipeAddComponent,
    RecipesComponent,
    RecipeDetailComponent,
    HeaderComponent,
    FooterComponent,
    Top9RecipesComponent,
    FavoritesComponent,
    BecomeAChefComponent,
    MyRecipesComponent,
    CandidatesComponent,
    AdminDashboardComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [AuthGuard, UserService],
  bootstrap: [AppComponent],
})
export class AppModule {}
