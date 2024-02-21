import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnakebarService {

  constructor(
    public snakeBar: MatSnackBar,
  ) { }

  generateSnakebar(txt: string, button: string, panelClass?: string, duration?: number) {
    this.snakeBar.open(
      txt,
      button, {
      duration: duration ? duration : 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['simple-snack-bar']
    });
  }
}
