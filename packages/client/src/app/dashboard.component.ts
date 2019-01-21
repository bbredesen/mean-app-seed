import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthService } from './auth/auth.service';

import * as model from 'berp-model';

const debug = require('debug')('client:dashboard');

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {
  me : model.admin.User;

  constructor(private http : HttpClient,
    private auth : AuthService) { }

  ngOnInit() {
    this.auth.getCurrentUser()
      .subscribe( response => {
        this.me = response; // JSON.stringify(response, null, 2);
      },
      error => {
        debug('Error when trying to get current user: %o', error);
      }
    );
  }

}
