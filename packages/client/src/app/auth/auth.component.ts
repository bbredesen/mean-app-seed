import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  template: '',
  styles: [ ]
})
export class AuthComponent implements OnInit {
  constructor(
    private auth : AuthService,
    private router : Router,
    private route : ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        if (params.jwt) {
          this.auth.setAuthToken(params.jwt);
        }
      });

    this.router.navigateByUrl('/');
  }

  get authToken() {
    return this.auth.getAuthToken();
  }
}
