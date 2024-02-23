import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { UserService } from '../shared/user.service';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../users/user';
import { SnakebarService } from '../shared/snakebar.service';
import { LoggerService } from '../shared/logger.service';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { LogoutDeleteComponent } from '../shared/dialog-box/logout-delete-dialog/logout-delete.component';
import { SpinnerComponent } from '../shared/spinner/spinner.component';
import { ProfilComponent } from '../profil/profil.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [MatTableModule, MatIconModule, FormsModule, MatInputModule, MatDialogModule, SpinnerComponent, ProfilComponent, MatButtonModule],
  templateUrl: './users-management.component.html',
  styleUrl: './users-management.component.scss'
})
export class UsersManagementComponent implements OnInit, OnDestroy {
  
  private logger = inject(LoggerService)
  private userService = inject(UserService)
  private snakeBar = inject(SnakebarService)
  private dialog = inject(MatDialog)
  public title = 'Gestion des utilisateurs'
  public displayedColumns: string[] = ['username', 'firstName', 'lastName', 'email', 'role', 'createDate', 'lastConnectionDate', 'rememberMe', 'edit', 'delete'];
  public dataSource: any;
  public isEditMode = false
  public isSpinner: boolean = false
  private userServiceSubscription = new Subscription();
  private logoutSubscription: Subscription = new Subscription();
  public selectedUser: User | undefined;

  ngOnInit(): void {
    this.refreshData()
  }
  
  refreshData() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.dataSource = data
      }
    })
  }

  deleteAccount(user: any) {
    this.userServiceSubscription = this.userService.deleteUser(user._id).subscribe({
      next: () => { this.refreshData() },
      error: (data) => {
        this.logger.error('in UsersManagementComponent.deleteDialog error', data.status, data.error.message)
        this.snakeBar.generateSnakebar('Un problèmé est survenue lors de la suppression', 'ERREUR')
      },
      complete: () => {
        this.snakeBar.generateSnakebar(`L\'utilisateur ${ user.username.toUpperCase() } a été` , 'SUPPRIMÉ')
      }
    })
  }

  edit(element: User) {
    this.isEditMode = !this.isEditMode
    this.selectedUser = this.userService.mapUser(element)
  }

  eventFromProfil() {
    this.isEditMode = !this.isEditMode
    this.refreshData()
  }

  deleteDialog(user: User): void {
    const dialog = this.dialog.open(LogoutDeleteComponent, {
      panelClass: 'custom-dialog-container',
      data: { title: `Supprimer le compte ${user.username} ?` }

    })
    this.logoutSubscription = dialog.afterClosed().subscribe(response => {
      if (response) {
        this.deleteAccount(user)
      }
  })
  }

  ngOnDestroy(): void {
    this.userServiceSubscription.unsubscribe()
    this.logoutSubscription.unsubscribe()
  }
}
