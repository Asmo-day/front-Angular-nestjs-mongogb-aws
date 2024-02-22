import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { UserService } from '../users/user.service';
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

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [MatTableModule, MatIconModule, FormsModule, MatInputModule, MatDialogModule, SpinnerComponent],
  templateUrl: './users-management.component.html',
  styleUrl: './users-management.component.scss'
})
export class UsersManagementComponent implements OnInit, OnDestroy {
  
  private logger = inject(LoggerService)
  private userService = inject(UserService)
  private snakeBar = inject(SnakebarService)
  private dialog = inject(MatDialog)
  public title = 'Gestion des utilisateurs'
  public displayedColumns: string[] = ['username', 'firstName', 'lastName', 'email', 'role', 'rememberMe', 'edit', 'delete'];
  public dataSource: any;
  public isEditMode = false
  public isSpinner: boolean = false
  private userServiceSubscription = new Subscription();

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

  delete(element: any) {
    this.deleteDialog(element);
    this.userServiceSubscription = this.userService.deleteUser(element._id).subscribe({
      next: () => { this.refreshData },
      error: (data) => {
        this.logger.error('in UsersManagementComponent.deleteDialog error', data.status, data.error.message)
        this.snakeBar.generateSnakebar('Un problèmé est survenue lors de la suppression', 'ERREUR')
      },
      complete: () => {
        this.snakeBar.generateSnakebar(`L\'utilisateur ${ element.username.toUpperCase() } a été` , 'SUPPRIMÉ')
      }
    })
  }

  edit() {
  }

  deleteDialog(userData: User): void {
    const dialog = this.dialog.open(LogoutDeleteComponent, {
      panelClass: 'custom-dialog-container',
      data: { userData: userData }
    })
    // this.logoutSubscription = dialog.afterClosed().subscribe(isLogout => {
    //   if (isLogout) {
    //     this.authService.userSignal.set({})
    //     this.cookiesService.deleteCookie('user')
    //     this.userRouteAccessService.isActivated.set(false);
    //     this.dialog.closeAll()
    //     this.router.navigate(['/home'])
    //   }
    // })
  }

  ngOnDestroy(): void {
    this.userServiceSubscription.unsubscribe()
  }

}
