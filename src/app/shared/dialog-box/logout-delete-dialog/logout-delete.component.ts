import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import 'hammerjs';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout-delete.component.html',
  styleUrl: './logout-delete.component.scss'
})
export class LogoutDeleteComponent {

  public title: string = '';

  constructor(
    private dialogRef: MatDialogRef<LogoutDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { this.title = data.title }

  logout() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close();
  }

}
