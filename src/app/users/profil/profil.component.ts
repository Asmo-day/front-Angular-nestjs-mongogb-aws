import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
// import { SnakebarService } from '../../shared/snakebar.service';
import { Router } from '@angular/router';
import { UserRouteAccessService } from '../../shared/user-route-access.service';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LogoutDeleteComponent } from '../../shared/dialog-box/logout-delete-dialog/logout-delete.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserDto } from '../../users/userDto';
import { AuthService } from '../../shared/auth.service';
import { SpinnerComponent } from '../../shared/spinner/spinner.component';
import { Roles } from '../../users/roles';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { EditUserIconDialogComponent } from '../../shared/dialog-box/edit-user-icon-dialog/edit-user-icon-dialog.component';
import { CookiesService } from '../../shared/cookies.service';
import { PasswordManagementComponent } from '../password-management/password-management.component';
import { InfoBarBuilder, InfoBarService, Type } from '../../shared/info-bar/info-bar.service';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, MatIconModule, ReactiveFormsModule, MatDialogModule, MatInputModule, MatFormFieldModule, SpinnerComponent, MatRadioButton, MatRadioGroup, PasswordManagementComponent],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss'
})

export class ProfilComponent implements OnInit, OnDestroy {

  @Input()
  public selectedUser: any;

  @Output()
  backToUserManagement = new EventEmitter();

  public title: string = 'Profil'
  private cookiesService = inject(CookiesService);
  private userService = inject(UserService)
  public dialog = inject(MatDialog)
  private infoBarService = inject(InfoBarService)
  public authService = inject(AuthService)
  private router = inject(Router)
  public userRouteAccessService = inject(UserRouteAccessService)
  private formBuilder = inject(FormBuilder)
  private deleteUserSubscription: Subscription = new Subscription();
  private logoutSubscription: Subscription = new Subscription();
  private editUserIconSubscription: Subscription = new Subscription();
  private updateUserSubscription: Subscription = new Subscription();
  public isSpinner: boolean = false
  public editMode: boolean = false
  public isAdminEdit: boolean = false
  public showPass: boolean = false
  private isUpdateUserFormChanged: boolean = false
  private UpdateUserFormChangedSubscription = new Subscription()
  public userToUpdate: any;
  public roles: { value: Roles, label: string }[] = [
    { value: Roles.USER, label: 'Utilisateur' },
    { value: Roles.ADMIN, label: 'Administrateur' },
  ];
  public updateUserForm = this.formBuilder.group({
    username: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.email],
    role: [''],
    userIcon: [''],
  });

  ngOnInit(): void {
    if (this.editMode) {
      this.toggleMode()

    }
    this.init()
    this.updateUserForm.valueChanges.subscribe(() => {
      this.isUpdateUserFormChanged = true
    });
  }

  init() {
    if (this.authService.isAdmin() && (this.selectedUser ?? '')) {
      this.title = `Gestion du compte : ${this.selectedUser.username.toUpperCase()}`
      this.isAdminEdit = true
      this.userToUpdate = this.selectedUser
      this.toggleMode()
    } else {
      this.userToUpdate = this.authService.userSignal()
    }
    this.resetForm()
  }

  resetForm() {
    this.updateUserForm.setValue({
      username: this.userToUpdate.username.toUpperCase(),
      firstName: this.userToUpdate.firstName,
      lastName: this.userToUpdate.lastName,
      email: this.userToUpdate.email,
      role: this.userToUpdate.role,
      userIcon: this.userToUpdate.userIcon,
    });
  }

  updateUser() {
    if (!this.isUpdateUserFormChanged) {
      this.infoBarService.generateSimpleInfoBar('Les informations n\'ont pas changé, Aucun changement détécté')
    } else if (this.updateUserForm.valid) {
      this.isSpinner = true
      const userDto: any = new UserDto(this.updateUserForm.value)
      this.updateUserSubscription = this.userService.updateUser(this.userToUpdate.id, userDto).subscribe({
        next: () => {
          if (this.isAdminEdit) {
            this.close()
          } else {
            if (this.editMode) {
              this.toggleMode()
            }
            let userForCookie = new UserDto({ username: userDto.username, userToken: this.userToUpdate.userToken, rememberMe: this.userToUpdate.rememberMe })
            this.cookiesService.set('user', userForCookie)
          }
          this.isSpinner = false
          this.infoBarService.generateSimpleInfoBar('Le profil a été mis à jour avec SUCCÉS')
          this.init()
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
          this.infoBarService.buildInfoBar(new InfoBarBuilder(`${error} Utilisateur non modifié`).withDuration(5000).withType(Type.WARNING))
        }
      })
    } else {
      const errors: string[] = [];
      this.updateUserForm.controls.username.errors ? errors.push('Nom d\'utilisateur') : '';
      this.updateUserForm.controls.firstName.errors ? errors.push('Prénom') : '';
      this.updateUserForm.controls.lastName.errors ? errors.push('Nom') : '';
      this.updateUserForm.controls.email.errors ? errors.push('Adresse e-mail') : '';
      this.infoBarService.buildInfoBar(new InfoBarBuilder((errors.length > 1 ? 'Erreur sur les champs : ' : 'Erreur sur le champ : ') + `${errors.join(', ')}`).withHeight('100px').withWidth('500px').withType(Type.WARNING).withIcon('warning'))
    }
  }

  deleteAccount() {
    this.isSpinner = true
    this.deleteUserSubscription = this.userService.deleteUser(this.userToUpdate.id).subscribe({
      next: () => {
        if (this.isAdminEdit) {
          this.infoBarService.generateSimpleInfoBar(`le compte ${this.userToUpdate.username.toUpperCase()} SUPPRIMÉ`)
          this.close()
        } else {
          this.userRouteAccessService.isActivated.set(false)
          this.authService.userSignal.set({})
          this.router.navigate(['/home'])
          this.infoBarService.generateSimpleInfoBar('Votre compte a été SUPPRIMÉ')
        }
        this.isSpinner = false
        this.dialog.closeAll()
      },
      error: (data) => {
        this.isSpinner = false
        console.warn(data)
        this.infoBarService.generateSimpleInfoBar('Une erreur est survenue')
      }
    });
  }

  deleteDialog(): void {
    const dialog = this.dialog.open(LogoutDeleteComponent, {
      panelClass: 'custom-dialog-container',
      data: { title: 'Supprimer votre compte ?' }
    })
    this.logoutSubscription = dialog.afterClosed().subscribe(response => {
      if (response) {
        this.deleteAccount()
      }
    })
  }

  cancel() {
    this.resetForm();
    this.toggleMode();
  }

  editUserIcon() {
    const dialog = this.dialog.open(EditUserIconDialogComponent, {
      panelClass: 'custom-dialog-container',
      data: { title: 'Photo de profil' }
    })
    this.editUserIconSubscription = dialog.afterClosed().subscribe(response => {
      if (response === undefined) {
        return
      }
      this.userToUpdate.userIcon = response === '' ? '' : response
      this.resetForm()
      this.updateUser()
    })
  }

  close() {
    this.backToUserManagement.emit()
  }

  toggleMode() {
    this.editMode = !this.editMode
    this.editMode ? document.documentElement.style.setProperty('--field-background-color', '#5c2eab') :
      document.documentElement.style.setProperty('--field-background-color', '#411d7f')
  }

  eventFromPasswordManagement() {
    this.toggleMode()
    this.showPass = false
  }

  changePass() {
    if (!this.editMode) {
      this.toggleMode()
    }
    this.showPass = true
  }

  ngOnDestroy(): void {
    this.deleteUserSubscription.unsubscribe()
    this.UpdateUserFormChangedSubscription.unsubscribe()
    this.logoutSubscription.unsubscribe()
    this.updateUserSubscription.unsubscribe()
    this.editUserIconSubscription.unsubscribe()
  }
}

