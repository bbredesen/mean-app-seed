import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

import * as model from 'berp-model';

const debug = require('debug')('client:app:header');

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [ 'mat-toolbar { clear: both; }' ]
})
export class HeaderComponent implements OnInit {
  private title = 'Your Application Name';
  private currentUser : model.admin.User;

  constructor(private auth : AuthService, private router : Router) { }

  ngOnInit() {
    this.auth.getCurrentUser()
      .subscribe( response => {
          this.currentUser = response;
        },
        error => {
          debug('Error when trying to get current user:');
          debug(error);
        }
      );
  }
}
