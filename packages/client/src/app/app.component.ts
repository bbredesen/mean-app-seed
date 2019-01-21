import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

import * as model from 'berp-model';

const debug = require('debug')('client:app');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent implements OnInit {
  currentUser : model.admin.User;

  constructor(private auth : AuthService) { }

  ngOnInit() {
    this.auth.getCurrentUser()
      .subscribe( response => {
          this.currentUser = response;
        },
        error => {
          debug('Error when trying to get current user: %o', error);
        }
      );
  }
}
