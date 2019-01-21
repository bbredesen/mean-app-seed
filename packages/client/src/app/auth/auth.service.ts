import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Router } from '@angular/router';

import * as model from 'berp-model';

import { AuthModule } from './auth.module';
import { JwtHelperService } from '@auth0/angular-jwt';

const debug = require('debug')('berp:client:auth:service');

@Injectable()
export class AuthService {
  private _currentUser = null;

  getCurrentUser() : BehaviorSubject<model.admin.User> {
    if (this._currentUser == null) {
      this._currentUser = new BehaviorSubject<model.admin.User>(null);
      this.updateCurrentUser();
    }
    return this._currentUser;
  }

  constructor(private http : HttpClient,
    private jwtHelper : JwtHelperService,
    private router : Router) { }

  updateCurrentUser() {
    console.log('update current user')
    if (this.haveAuthToken())
      this.http.get<model.admin.User>('/api/admin/user/me')
        .subscribe( result => this._currentUser.next(result) )
    else
      this._currentUser.next(null);
  }

  logout() {
    debug('Log out user %s', this._currentUser.email);
    this.http.get('/logout'); // No subscription here becuase we don't really care about the response
    localStorage.clear();
    this.updateCurrentUser();
    this.router.navigateByUrl('/')
  }

  haveAuthToken() : boolean {
    return !!this.getAuthToken() && !this.jwtHelper.isTokenExpired(this.getAuthToken());
  }

  getAuthToken() {
    return localStorage.getItem('access_token');
  }
  setAuthToken(token : string) {
    console.log('set auth token');
    localStorage.setItem('access_token', token);
    this.updateCurrentUser();
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else if (error) {
      if (error.status === 403) { // Forbidden, meaning we are not authorized
        localStorage.removeItem('access_token');
        this.updateCurrentUser(); // Clears the BehaviorSubject
        return throwError('Not logged in, or your token was revoked.');
      } else if (error.status) {
        const msg = `Backend returned code ${error.status}, body was: ${error.error}`;

        console.error(msg)
        return throwError(msg);
      }
    }
  }
}
