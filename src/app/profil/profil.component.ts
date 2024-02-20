import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { UserService } from '../users/user.service';
import { User } from '../users/user';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { SnakebarService } from '../snakebar.service';
import { Router } from '@angular/router';
import { UserRouteAccessService } from '../users/user-route-access.service';
import { Subscription } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LogoutComponent } from '../dialog-box/logout-dialog/logout.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserDto } from '../users/userDto';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, MatIconModule, ReactiveFormsModule, MatDialogModule, MatInputModule, MatFormFieldModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss'
})

export class ProfilComponent implements OnInit, OnDestroy {

  public title: string = 'Profil'
  private userService = inject(UserService)
  public dialog = inject(MatDialog)
  public snakeBar = inject(SnakebarService)
  private router = inject(Router)
  public userRouteAccessService = inject(UserRouteAccessService)
  public userSignal: any;
  private deleteUserSubscription: Subscription = new Subscription();
  private logoutSubscription: Subscription = new Subscription();
  private updateUserSubscription: Subscription = new Subscription();
  private passRegx: RegExp = /^(?=.*\W)(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
  private formBuilder = inject(FormBuilder)
  public showPass: boolean = false
  public edit = false
  public disableUsernameEdit = true
  public disableFirstNameEdit = true
  public disableLastNameEdit = true
  public disableEmailEdit = true
  public updateUserForm = this.formBuilder.group({
    username: ['', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.email],
    // password: ['', [Validators.required, Validators.pattern(this.passRegx)]],
  });

  ngOnInit(): void {
    this.userSignal = this.userService.userSignal
    this.resetForm()
  }

  resetForm() {
    this.updateUserForm.setValue({
      username: this.userSignal().username.toUpperCase(),
      firstName: this.userSignal().firstName,
      lastName: this.userSignal().lastName,
      email: this.userSignal().email,
      // password: 'h'
    });

      this.disableUsernameEdit = true
      this.disableFirstNameEdit = true
      this.disableLastNameEdit = true
      this.disableEmailEdit = true
  }

  updateUser(userId: string) {
    console.log('in updateUser');
    
    if (this.updateUserForm.value.username === this.userSignal().username.toUpperCase() &&
    this.updateUserForm.value.firstName === this.userSignal().firstName &&
    this.updateUserForm.value.lastName === this.userSignal().lastName &&
    this.updateUserForm.value.email === this.userSignal().email ) {
      this.snakeBar.generateSnakebar('Les information n\'ont pas changé', '')
      
    } else {
      if (this.updateUserForm.valid) {
        const userDto: UserDto = new UserDto(this.updateUserForm.value)
        this.updateUserSubscription = this.userService.updateUser(userId, userDto).subscribe({
          next: (data) => {
            console.log(data);
            
          }
        })
      }

    }
  }

  deleteAccount(userId: string) {
    this.deleteUserSubscription = this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.snakeBar.generateSnakebar('Votre compte a été', 'SUPPRIMÉ')
        this.userRouteAccessService.isActivated.set(false)
        this.userSignal.set({})
        this.router.navigate(['/home'])
        this.dialog.closeAll()
      },
      error: (data) => {
        console.warn(data)
        this.snakeBar.generateSnakebar('Une erreur est ', 'SUPPRIMÉ')
      }
    });
  }

  logoutDialog(username: string): void {
    const dialog = this.dialog.open(LogoutComponent, {
      panelClass: 'custom-dialog-container',
      data: { title: 'Supprimer votre compte ?' }
    })
    this.logoutSubscription = dialog.afterClosed().subscribe(response => {
      if (response) {
        this.deleteAccount(username)
      }
    })
  }

  ngOnDestroy(): void {
    this.deleteUserSubscription.unsubscribe()
    this.logoutSubscription.unsubscribe()
    this.updateUserSubscription.unsubscribe()
  }

}
