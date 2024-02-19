import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule, RouterOutlet, RouterLinkActive, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { UserRouteAccessService } from './users/user-route-access.service';
import { LogoutComponent } from './dialog-box/logout-dialog/logout.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserService } from './users/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, RouterOutlet, RouterLink, RouterModule, MatMenuModule, MatMenuModule, MatButtonModule, RouterLinkActive, MatTabsModule, MatIconModule, MatDialogModule],
})

export class AppComponent implements OnInit {
  
  public dialog = inject(MatDialog)
  public router = inject(Router)
  public userService = inject(UserService)
  public userRouteAccessService = inject(UserRouteAccessService)
  public userSignal: any;
  
  ngOnInit(): void {
    this.userSignal = this.userService.userSignal
  }
  
  signInOut() {
    if (this.userRouteAccessService.isActivated()) {
      this.logoutDialog()
    } else {
      this.router.navigate(['/user'])
    }
  }

  manageProfil() {
    this.router.navigate(['/profil'])
  }

  logoutDialog(): void {
    this.dialog.open(LogoutComponent, {
      panelClass: 'custom-dialog-container',
    }).afterClosed().subscribe(data => {
      if (data) {
        this.userService.userSignal.set({})
        this.userRouteAccessService.isActivated.set(false);
        this.dialog.closeAll()
        this.router.navigate(['/home'])
      }
    })
  }

}
