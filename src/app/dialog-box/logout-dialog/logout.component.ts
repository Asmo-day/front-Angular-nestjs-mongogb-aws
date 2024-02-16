import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {

  constructor(private dialogRef: MatDialogRef<LogoutComponent>) { }

  logout() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close();
  }

}
