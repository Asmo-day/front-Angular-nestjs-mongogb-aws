import { SignInDto } from './users/signInDto';
import { CUSTOM_ELEMENTS_SCHEMA, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule, RouterOutlet, RouterLinkActive, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { UserRouteAccessService } from './shared/user-route-access.service';
import { LogoutDeleteComponent } from './shared/dialog-box/logout-delete-dialog/logout-delete.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserService } from './shared/user.service';
import { Subscription } from 'rxjs';
import { CookiesService } from './shared/cookies.service';
import { User } from './users/user';
import { LoggerService } from './shared/logger.service';
import { AuthService } from './shared/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, RouterOutlet, RouterLink, RouterModule, MatMenuModule, MatMenuModule, MatButtonModule, RouterLinkActive, MatTabsModule, MatIconModule, MatDialogModule],
})

export class AppComponent implements OnInit, OnDestroy {

  private dialog = inject(MatDialog)
  public router = inject(Router)
  private cookiesService = inject(CookiesService)
  private logger = inject(LoggerService)
  public authService = inject(AuthService)
  public userService = inject(UserService)
  public userRouteAccessService = inject(UserRouteAccessService)
  public userSignal: any;
  private logoutSubscription: Subscription = new Subscription();
  private signinSubscription: Subscription = new Subscription();

  ngOnInit() {
    this.userSignal = this.authService.userSignal
    this.rememberMe()
  }

  rememberMe() {
    const userFromCookie: User = this.cookiesService.get('user')
    this.logger.info('in AppComponent.rememberMe', userFromCookie);
    if ((userFromCookie ?? '') && userFromCookie.rememberMe) {
      this.signinSubscription = this.userService.signIn(new SignInDto(userFromCookie)).subscribe()
    } else {
      this.logger.info('No cookie found for user')
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
    const dialog = this.dialog.open(LogoutDeleteComponent, {
      panelClass: 'custom-dialog-container',
      data: { title: 'Se deconnecter ?' }
    })
    this.logoutSubscription = dialog.afterClosed().subscribe(isLogout => {
      if (isLogout) {
        this.authService.userSignal.set({})
        this.cookiesService.deleteCookie('user')
        this.userRouteAccessService.isActivated.set(false);
        this.dialog.closeAll()
        this.router.navigate(['/home'])
      }
    })
  }

  ngOnDestroy(): void {
    this.logoutSubscription.unsubscribe()
    this.signinSubscription.unsubscribe()
  }
}
