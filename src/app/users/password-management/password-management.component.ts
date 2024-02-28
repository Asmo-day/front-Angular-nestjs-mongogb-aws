import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../shared/user.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserDto } from '../userDto';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-password-management',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatInputModule, ReactiveFormsModule, FormsModule],
  templateUrl: './password-management.component.html',
  styleUrls: ['./password-management.component.scss', '../profil/profil.component.scss']
})
export class PasswordManagementComponent {

  @Input()
  public userToUpdate: any;

  @Output()
  backToProfil = new EventEmitter();

  public title: string = 'Changement de mot de passe'

  private userService = inject(UserService)
  private formBuilder = inject(FormBuilder)
  private passRegx: RegExp = /^(?=.*\W)(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
  public showPass: boolean = false
  public isWrongNewPass: boolean = false
  public isNewEqualOldPass: boolean = false
  public isConfirmChanges: boolean = false
  public isFormError: boolean = false
  public isWrongUserPassword: boolean = false
  public errors: string = ''
  public passUserForm = this.formBuilder.group({
    oldPassword: ['', [Validators.required, Validators.minLength(8)]],
    newPassword: ['', [Validators.required, Validators.pattern(this.passRegx)]],
    confirmePassword: ['', [Validators.required, Validators.minLength(8)]],
  });


  cancelGoBack() {
    this.backToProfil.emit()
  }

  updateUserPass() {
    this.isWrongNewPass = false
    this.isNewEqualOldPass = false
    this.isWrongUserPassword = false
    if (this.passUserForm.controls.newPassword.getRawValue() !== this.passUserForm.controls.confirmePassword.getRawValue()) {
      this.isWrongNewPass = true
    } else if (this.passUserForm.controls.newPassword.getRawValue() === this.passUserForm.controls.oldPassword.getRawValue()) {
      this.isNewEqualOldPass = true
    } else if (this.passUserForm.valid) {
      const updateUserPass = this.passUserForm.value as UserDto
      this.userService.updateUserPassword(this.userToUpdate.id, updateUserPass).subscribe({
        next: (data: any) => {
          this.isConfirmChanges = true
          console.log(data);
        },
        error: (data: HttpErrorResponse) => {
          console.log(data.error.message)
          if (data.error.message.includes('Wrong password')) {
            this.isWrongUserPassword = true
          }

        }


      })
    } else {
      this.isFormError = true
      const errors: string[] = [];
      this.passUserForm.controls.newPassword.errors ? errors.push('Mot de passe actuel') : '';
      this.passUserForm.controls.oldPassword.errors ? errors.push('Nouveau mot de passe') : '';
      this.errors = `Erreur! Veuillez vérifier les données suivantes : ${errors.join(', ')}`
    }
  }
}
