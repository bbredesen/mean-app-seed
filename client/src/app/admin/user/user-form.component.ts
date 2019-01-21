import { Component, Inject, Input, Output, OnInit, EventEmitter } from '@angular/core';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import * as model from 'seed-model';

import { tap, flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styles: []
})
export class UserFormComponent implements OnInit {

  // Local copy that can be modified without being reflected in the side-menu
  private _rec : model.admin.User;

  @Output() formComplete : EventEmitter<string> = new EventEmitter<string>();

  @Input() set rec(obj : model.admin.User) {
    // Clone the incoming User object
    if (obj)
      this._rec = Object.assign({}, obj);
    else
      this._rec = null;
  }
  get rec() : model.admin.User { return this._rec; }

  constructor(
    private auth : AuthService,
    private http : HttpClient,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  submitForm() {
    console.log('-> submitForm()');
    if (this._rec['_id']) {
      this.http.put(`/api/admin/user/${this._rec['_id']}`, this._rec)
        .subscribe( result => {
          this.formComplete.emit(`User form has been submitted.`);
          this._rec = null;
        } );
    } else {
      this.auth.getCurrentUser()
        .pipe(
          // tap( user => this._rec.organization = user.organization ),
          flatMap( () => this.http.post(`/api/admin/user`, this._rec) ),
          tap( result => {
            console.log('Posted new user record, result is:')
            console.log(result);
          } ),
        )
        .subscribe( result => {
          this.formComplete.emit(`User form has been submitted.`);
          this._rec = null;
        })


    }
  }

  cancelForm() {
    this._rec = null;
    this.formComplete.emit(`User form has been cancelled.`);
  }

  confirmDeleteUser(record : model.admin.User) {
    const dialogRef = this.dialog.open(DeleteUserRecordDialog, {
      width: '400px',
      data: { record: record }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // remove the record from the dataset...
        this.http.delete(`/api/admin/user/${record['_id']}`)
          .subscribe( result => {
            this.formComplete.emit(`User record has been deleted.`);
            this.rec = null;
          });
      }
    });
  }
}

@Component({
  selector: 'app-user-form-delete-dialog',
  template: `
  <h2>Delete Record</h2>
  <mat-dialog-content>Are you sure you want to permanently delete this user record? ({{data.record.surname}})</mat-dialog-content>
  <mat-dialog-actions>
    <button mat-button mat-dialog-close>No</button>
    <button mat-button [mat-dialog-close]="true">Yes</button>
  </mat-dialog-actions>
    `,
})
export class DeleteUserRecordDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteUserRecordDialog>,
    @Inject(MAT_DIALOG_DATA) public data: model.admin.User
  ) { }

  onNoClick(): void {
    console.log('-> onNoClick()')
    this.dialogRef.close();
  }
}
