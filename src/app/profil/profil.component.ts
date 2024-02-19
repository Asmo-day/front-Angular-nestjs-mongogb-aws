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
  private router = inject(Router)
  private snakebar = inject(SnakebarService)
  public userRouteAccessService = inject(UserRouteAccessService)
  public userSignal: any;
  private deleteUserSubscription: Subscription = new Subscription();
  private logoutSubscription: Subscription = new Subscription();
  private passRegx: RegExp = /^(?=.*\W)(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
  private formBuilder = inject(FormBuilder)
  public showPass: boolean = false
  public edit = false
  public updateUserForm = this.formBuilder.group({
    username: ['vwxcv', Validators.required],
    firstName: [''],
    lastName: [''],
    email: [''],
    password: ['', [Validators.required, Validators.pattern(this.passRegx)]],
  });

  ngOnInit(): void {
    this.userSignal = this.userService.userSignal
  }

  updateUser() {
    if (this.updateUserForm.valid) {
      console.log('in updateUserForm');

    }
  }

  deleteAccount(username: string) {
    this.deleteUserSubscription = this.userService.deleteUser(username).subscribe({
      next: (data) => {
        this.snakebar.generateSnakebar('Votre compte a été', 'SUPPRIMÉ')
        this.userRouteAccessService.isActivated.set(false)
        this.userSignal.set({})
        this.router.navigate(['/home'])
        this.dialog.closeAll()
      },
      error: (data) => {
        console.warn(data)
        this.snakebar.generateSnakebar('Une erreur est ', 'SUPPRIMÉ')
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
  }

}
