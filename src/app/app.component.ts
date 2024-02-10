import { CUSTOM_ELEMENTS_SCHEMA, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EmailDto } from './emailDto';
import { MatInputModule } from '@angular/material/input';
import { MailerService } from './mailer.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Snakebar } from './snakebar.service';
import { WaitDialogComponent } from './wait-dialog/wait-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  providers: [MailerService],
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, MatDialogModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppComponent {

  private formBuilder = inject(FormBuilder)
  public snakeBar = inject(Snakebar)
  public dialog = inject(MatDialog)
  public mailerService = inject(MailerService)

  emailForm = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: ['', Validators.required],
  });

  onSubmit() {
    this.waitDialog()
    let sendEmailDto = new EmailDto(this.emailForm.value)
    this.mailerService.postEmailContent(sendEmailDto).subscribe({
      next: () => { },
      error: () => {
        this.dialog.closeAll()
        this.snakeBar.generateSnakebar('Une erreur est survenue lors de l\'envoie de l\'e-mail', '')
      },
      complete: () => {
        this.dialog.closeAll(); this.snakeBar.generateSnakebar('Votre Message a bien été ', 'envoyé !');
        this.emailForm.reset();
        Object.keys(this.emailForm.controls).forEach((key) => {
          this.emailForm.get(key)?.setErrors(null)
        })
      },
    })
  }

  waitDialog(): void {
    this.dialog.open(WaitDialogComponent, {
      panelClass: 'custom-dialog-container',
      disableClose: true,
    });
  }
}