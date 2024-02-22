import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnDestroy, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { EmailDto } from './emailDto';
import { MailerService } from './mailer.service';
import { SnakebarService } from '../shared/snakebar.service';
import { WaitDialogComponent } from '../shared/dialog-box/wait-dialog/wait-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-email',
  standalone: true,
  templateUrl: './email.component.html',
  styleUrl: './email.component.scss',
  providers: [MailerService],
  imports: [CommonModule, RouterOutlet, RouterModule, ReactiveFormsModule, MatButtonModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSnackBarModule, MatDialogModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class EmailComponent implements OnDestroy {

  private formBuilder = inject(FormBuilder)
  private snakeBar = inject(SnakebarService)
  private dialog = inject(MatDialog)
  private mailerService = inject(MailerService)
  private router = inject(Router)
  public title: string = 'Contactez nous !'
  emailForm = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: ['', Validators.required],
  });
  private mailerSubscription: Subscription = new Subscription();

  onSubmit() {
    this.waitDialog()
    const sendEmailDto = new EmailDto(this.emailForm.value)
    this.mailerSubscription = this.mailerService.postEmailContent(sendEmailDto).subscribe({
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

  ngOnDestroy(): void {
    this.mailerSubscription.unsubscribe()
  }

}
