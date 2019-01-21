import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserListComponent } from './user/user-list.component';
import { UserFormComponent } from './user/user-form.component';

import { AuthGuard } from '../auth/auth-guard.service';

const routes: Routes = [
  {
    path: 'admin',
    canActivate: [AuthGuard],
    children: [
      { path: 'user', component: UserListComponent },
      { path: 'user/new', component: UserFormComponent },
      { path: 'user/:id', component: UserFormComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
