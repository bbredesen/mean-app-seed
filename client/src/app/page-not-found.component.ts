import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  template: `
  <mat-card>
    <h2>Page not found</h2>
    <a routerLink="/">Return to the dashboard</a>
  </mat-card>
  `,
  styles: []
})
export class PageNotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
