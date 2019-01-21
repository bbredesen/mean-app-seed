import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthComponent } from '../auth/auth.component';

import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';

import { AuthService } from './auth.service';
import { AuthGuard } from './auth-guard.service';

@NgModule({
  imports: [
    CommonModule,

    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: (new AuthService(null, null, null)).getAuthToken,
        whitelistedDomains: [ 'localhost' ], // Only really needed for non-origin domains
        blacklistedRoutes: [ ]
      }
    })
  ],
  declarations: [AuthComponent],
  // exports: [AuthComponent]
  providers: [ AuthService, AuthGuard ]
})
export class AuthModule {
  constructor(private auth : AuthService) { }
}
