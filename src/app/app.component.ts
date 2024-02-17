import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule, RouterOutlet, RouterLinkActive, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { UserRouteAccessService } from './users/user-route-access.service';
import { LogoutComponent } from './dialog-box/logout-dialog/logout.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterModule, MatMenuModule, MatMenuModule, MatButtonModule, RouterLinkActive, MatTabsModule, MatIconModule, MatDialogModule],
})

export class AppComponent {

  public dialog = inject(MatDialog)
  public router = inject(Router)
  public userRouteAccessService = inject(UserRouteAccessService)

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
        this.userRouteAccessService.isActivated.set(false);
        this.dialog.closeAll()
        this.router.navigate(['/home'])
      }
    })
  }

}
