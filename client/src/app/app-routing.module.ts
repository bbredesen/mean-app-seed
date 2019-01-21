import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminRoutingModule } from './admin/admin-routing.module';

import { DashboardComponent } from './dashboard.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { AuthComponent } from './auth/auth.component';

const routes: Routes = [
  { path: 'login/success', component: AuthComponent }, // Note that this path is a config option on the server
  { path: '', component: DashboardComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    AdminRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
