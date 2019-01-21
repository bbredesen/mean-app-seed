import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatMenuModule,
  MatToolbarModule,
} from '@angular/material';

import { ClipboardModule } from 'ngx-clipboard';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';

import { PageNotFoundComponent } from './page-not-found.component';
import { DashboardComponent } from './dashboard.component';
import { HeaderComponent } from './header.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    DashboardComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,

    AppRoutingModule,
    AuthModule,
    AdminModule,

    BrowserAnimationsModule,
    ClipboardModule,
    
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
