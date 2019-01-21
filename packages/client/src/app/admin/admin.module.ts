import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { UserListComponent } from './user/user-list.component';
import { UserFormComponent, DeleteUserRecordDialog } from './user/user-form.component';

import {
  MatButtonModule,
  MatCardModule,
  MatDatepickerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatSelectModule,
  MatOptionModule,
  MatSidenavModule,

  MatNativeDateModule
} from '@angular/material';

import { FlexLayoutModule } from '@angular/flex-layout';
import { DateAdapter, NativeDateAdapter } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    AdminRoutingModule,

    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSidenavModule,
    MatSelectModule,
    MatOptionModule,

    MatDialogModule,

    MatNativeDateModule,
    FlexLayoutModule
  ],
  declarations: [UserListComponent, UserFormComponent, DeleteUserRecordDialog],
  entryComponents: [DeleteUserRecordDialog],
  exports: [ ],
  providers : [ { provide: DateAdapter, useClass : NativeDateAdapter }]
})
export class AdminModule { }
