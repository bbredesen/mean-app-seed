import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';


import * as model from 'seed-model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styles: [ `
    mat-nav-list {
      width: 220px;
      overflow-x: hidden;
    }
    [mat-list-item] {
      cursor: pointer;
      margin: 0.5em 0;
      padding: 0 0.5em;
    }
    [mat-list-item].selected {
      background-color: #ddd;
      font-weight: bold;
    }
    h4, p {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    `]
})
export class UserListComponent implements OnInit, OnDestroy {
  users : model.admin.User[];
  selectedRecord : model.admin.User = null;

  private mediaChangeSub : Subscription;
  mqAlias : string = '';
  mediaIsXs : boolean = false;

  constructor(
    private http : HttpClient,
    private mo : MediaObserver
    ) {
    this.mediaChangeSub = mo.media$.subscribe((change: MediaChange) => {
      console.log(`MediaChange observed: mqAlias = ${change.mqAlias}; mediaQuery = ${change.mediaQuery}, matches = ${change.matches}`);
      // console.log(`Assign activeMediaQuery = '${change.mqAlias}' = (${change.mediaQuery})`)
      // this.activeMediaQuery = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : '';
      // console.log(this.activeMediaQuery);
      this.mqAlias = change.mqAlias;
      this.mediaIsXs = change.mqAlias === 'xs';
      // if ( change.mqAlias == 'xs') {
      //    this.loadMobileContent();
      // }
    });
  }

  ngOnInit() {
    this.http.get<model.admin.User[]>('/api/admin/user/list')
      .subscribe( result => this.users = result )
  }

  ngOnDestroy() {
    this.mediaChangeSub.unsubscribe();
  }

  loadMobileContent() {
    // Do something special since the viewport is currently
    // using mobile display sizes
  }

  selectRecord(user : model.admin.User) {
    this.selectedRecord = user;
  }
  newRecord() {
    this.selectedRecord = model.admin.initDefaultUser();
  }

  onFormComplete(event) {
    console.log('Received event: ', event);
    this.selectedRecord = null;
    this.ngOnInit();
  }

}
