import { Injectable } from '@angular/core';
import {
  CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot
} from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard {

  constructor(private authService : AuthService,
    private router : Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : boolean {
    let url: string = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    if (this.authService.haveAuthToken()) { return true; }

    // Navigate to the home page
    this.router.navigate(['/']);
    return false;
  }
}
