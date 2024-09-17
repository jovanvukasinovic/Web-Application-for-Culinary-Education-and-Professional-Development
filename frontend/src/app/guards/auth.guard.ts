import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    const allowedRoutesForGuest = ['login', 'register', 'admin-login'];

    const allowedRoutesForUser = [
      'profile',
      'recipe-add',
      'favourites',
      'become-a-chef',
    ];

    const allowedRoutesForChef = [
      'profile',
      'recipe-add',
      'favourites',
      'my-recipes',
      'candidates',
    ];

    const allowedRoutesForAdmin = [
      'register',
      'profile',
      'admin-dashboard-users',
      'admin-dashboard-recipes',
      'recipe-add',
      'favourites',
      'my-recipes',
      'candidates',
    ];

    // If guest (no currentUser in localStorage)
    if (!currentUser.role) {
      if (allowedRoutesForGuest.includes(route.routeConfig?.path || '')) {
        return true;
      } else {
        this.router.navigate(['']);
        return false;
      }
    }

    // If user
    if (currentUser.role === 'user') {
      if (route.routeConfig?.path === 'recipe-add') {
        if (currentUser.recipesCount >= 3) {
          this.router.navigate(['']);
          return false;
        } else {
          return true;
        }
      }
      if (allowedRoutesForUser.includes(route.routeConfig?.path || '')) {
        return true;
      } else {
        this.router.navigate(['']);
        return false;
      }
    }

    // If chef
    if (currentUser.role === 'chef') {
      if (allowedRoutesForChef.includes(route.routeConfig?.path || '')) {
        return true;
      } else {
        this.router.navigate(['']);
        return false;
      }
    }

    // If admin
    if (currentUser.role === 'admin') {
      if (allowedRoutesForAdmin.includes(route.routeConfig?.path || '')) {
        return true;
      } else {
        this.router.navigate(['']);
        return false;
      }
    }

    // Default fallback (if none of the roles match)
    this.router.navigate(['']);
    return false;
  }
}
