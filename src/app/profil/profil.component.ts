import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { UserService } from '../users/user.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { SnakebarService } from '../shared/snakebar.service';
import { Router } from '@angular/router';
import { UserRouteAccessService } from '../shared/user-route-access.service';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LogoutDeleteComponent } from '../shared/dialog-box/logout-delete-dialog/logout-delete.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserDto } from '../users/userDto';
import { AuthService } from '../shared/auth.service';
import { SpinnerComponent } from '../shared/spinner/spinner.component';
import { User } from '../users/user';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, MatIconModule, ReactiveFormsModule, MatDialogModule, MatInputModule, MatFormFieldModule, SpinnerComponent],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss'
})

export class ProfilComponent implements OnInit, OnDestroy {

  @Input()
  public selectedUser: any;

  public title: string = 'Profil'
  private userService = inject(UserService)
  public dialog = inject(MatDialog)
  public snakeBar = inject(SnakebarService)
  public authService = inject(AuthService)
  private router = inject(Router)
  public userRouteAccessService = inject(UserRouteAccessService)
  public userSignal: any;
  private deleteUserSubscription: Subscription = new Subscription();
  private logoutSubscription: Subscription = new Subscription();
  private updateUserSubscription: Subscription = new Subscription();
  // private passRegx: RegExp = /^(?=.*\W)(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
  private formBuilder = inject(FormBuilder)
  public showPass: boolean = false
  public isSpinner: boolean = false
  public editMode: boolean = false
  private userToUpdate: any;
  public updateUserForm = this.formBuilder.group({
    username: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.email],
    // password: ['', [Validators.required, Validators.pattern(this.passRegx)]],
  });

  ngOnInit(): void {
    this.userSignal = this.authService.userSignal
    console.log(this.updateUser);
    this.userToUpdate = (this.authService.isAdmin() &&  (this.selectedUser ?? '') ? this.selectedUser : this.userSignal())
    
    this.resetForm()
  }
  
  resetForm() {
      this.updateUserForm.setValue({
        username: this.userToUpdate.username.toUpperCase(),
        firstName: this.userToUpdate.firstName,
        lastName: this.userToUpdate.lastName,
        email: this.userToUpdate.email
      });
  }

  updateUser(userId: string) {
console.log(userId);
console.log(this.updateUserForm.valid);


    if (this.isPropertiesChanged()) {
      this.snakeBar.generateSnakebar('Les informations n\'ont pas changé', 'Aucun changement détécté')
    } else if (this.updateUserForm.valid) {
      this.isSpinner = true
      const userDto: UserDto = new UserDto(this.updateUserForm.value)
      this.updateUserSubscription = this.userService.updateUser(userId, userDto).subscribe({
        next: () => {
          this.toggleMode()
          this.isSpinner = false
          this.snakeBar.generateSnakebar('Le profil a été mis à jour avec', 'SUCCÉS')
        },
        error: (data) => {
          this.isSpinner = false
          let error: string;
          if (data.status === 400) {
            console.warn(data.error.message);
            error = 'Le nom d\'utilisateur existe déjà'

          } else {
            console.warn('error during user creation ' + data);
            error = 'Une erreur est survenue'
          }
          this.snakeBar.generateSnakebar(`${error}`, 'Utilisateur non modifié', undefined, 5000)
        }
      })
    } else {
      const errors: string[] = [];
      this.updateUserForm.controls.username.errors ? errors.push('Nom d\'utilisateur') : '';
      this.updateUserForm.controls.firstName.errors ? errors.push('prénom') : '';
      this.updateUserForm.controls.lastName.errors ? errors.push('Nom') : '';
      this.updateUserForm.controls.email.errors ? errors.push('Adresse e-mail') : '';
      this.snakeBar.generateSnakebar('Erreur ! Veuillez vérifier les données suivantes : ', errors.join(', '))
    }
  }

  deleteAccount(userId: string) {

    this.isSpinner = true
    this.deleteUserSubscription = this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.isSpinner = false
        this.snakeBar.generateSnakebar('Votre compte a été', 'SUPPRIMÉ')
        this.userRouteAccessService.isActivated.set(false)
        this.userSignal.set({})
        this.router.navigate(['/home'])
        this.dialog.closeAll()
      },
      error: (data) => {
        this.isSpinner = false
        console.warn(data)
        this.snakeBar.generateSnakebar('Une erreur est ', 'SUPPRIMÉ')
      }
    });
  }

  deleteDialog(username: string): void {
    const dialog = this.dialog.open(LogoutDeleteComponent, {
      panelClass: 'custom-dialog-container',
      data: { title: 'Supprimer votre compte ?' }
    })
    this.logoutSubscription = dialog.afterClosed().subscribe(response => {
      if (response) {
        this.deleteAccount(username)
      }
    })
  }

  toggleMode() {
    this.editMode = !this.editMode
    this.editMode ? document.documentElement.style.setProperty('--field-background-color', '#5c2eab') :
      document.documentElement.style.setProperty('--field-background-color', '#411d7f')

  }

  ngOnDestroy(): void {
    this.deleteUserSubscription.unsubscribe()
    this.logoutSubscription.unsubscribe()
    this.updateUserSubscription.unsubscribe()
  }

  isPropertiesChanged() {
    return this.updateUserForm.value.username === this.userSignal().username.toUpperCase() &&
      this.updateUserForm.value.firstName === this.userSignal().firstName &&
      this.updateUserForm.value.lastName === this.userSignal().lastName &&
      this.updateUserForm.value.email === this.userSignal().email
  }

}

