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
import { AdminHomePageComponent } from './admin-home-page/admin-home-page.component'; // Izmenite putanju prema vašoj strukturi projekta

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminLoginComponent,
    ProfileComponent,
    AdminHomePageComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, FormsModule],
  providers: [AuthGuard, UserService],
  bootstrap: [AppComponent],
})
export class AppModule {}
