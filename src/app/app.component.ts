import { SignInDto } from './users/signInDto';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnDestroy, OnInit, inject } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { CookiesService } from './cookies.service';
import { User } from './users/user';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, RouterOutlet, RouterLink, RouterModule, MatMenuModule, MatMenuModule, MatButtonModule, RouterLinkActive, MatTabsModule, MatIconModule, MatDialogModule],
})

export class AppComponent implements OnInit, OnDestroy {

  public dialog = inject(MatDialog)
  public router = inject(Router)
  private cookiesService = inject(CookiesService)
  public userService = inject(UserService)
  public userRouteAccessService = inject(UserRouteAccessService)
  public userSignal: any;
  private logoutSubscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.userSignal = this.userService.userSignal
    const userFromCookie: User = this.cookiesService.get('user')

    if (userFromCookie ?? '') {
      console.log(
        this.cookiesService.get('user')
      );
      this.userService.signIn(new SignInDto(userFromCookie)).subscribe({
        next: (data) => {
          console.log(data);

        }
      })

    }
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
    const dialog = this.dialog.open(LogoutComponent, {
      panelClass: 'custom-dialog-container',
      data: { title: 'Se deconnecter ?' }
    })
    this.logoutSubscription = dialog.afterClosed().subscribe(data => {
      if (data) {
        this.userService.userSignal.set({})
        this.cookiesService.deleteCookie('user')
        this.userRouteAccessService.isActivated.set(false);
        this.dialog.closeAll()
        this.router.navigate(['/home'])
      }
    })
  }

  ngOnDestroy(): void {
    this.logoutSubscription.unsubscribe()
  }
}
