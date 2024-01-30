import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class Snakebar {

  constructor(
    public snakeBar: MatSnackBar,
  ) { }

  generateSnakebar(leftTxt: string, rightTxt: string, panelClass?: string, duration?: number) {
    this.snakeBar.open(
      leftTxt,
      rightTxt, {
      duration: duration ? duration : 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass
    });
  }
}
