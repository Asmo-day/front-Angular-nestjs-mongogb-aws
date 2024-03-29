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
import { UserDto } from './users/userDto';
import { InfoBarComponent } from './shared/info-bar/info-bar.component';
import { InfoBarBuilder, InfoBarService } from './shared/info-bar/info-bar.service';
import { StorageService } from './shared/storage.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, RouterOutlet, RouterLink, InfoBarComponent, RouterModule, MatMenuModule, MatMenuModule, MatButtonModule, RouterLinkActive, MatTabsModule, MatIconModule, MatDialogModule],
})

export class AppComponent implements OnInit, OnDestroy {

  private dialog = inject(MatDialog)
  public router = inject(Router)
  private cookiesService = inject(CookiesService)
  private infoBarService = inject(InfoBarService)
  private storageService = inject(StorageService)
  private logger = inject(LoggerService)
  public authService = inject(AuthService)
  public userService = inject(UserService)
  public userRouteAccessService = inject(UserRouteAccessService)
  private logoutSubscription: Subscription = new Subscription();
  private signinSubscription: Subscription = new Subscription();

  ngOnInit() {
    console.log(this.cookiesService.cookiesAllowed());

    if (this.storageService.get('cookiesAllowed') === '' || this.storageService.get('cookiesAllowed') === null) {
      this.infoBarService.buildInfoBar(new InfoBarBuilder('Tu veux des cookies ?').withButtons(true).withIcon('cookie').withDuration(3600000).withHeight('200px').withIconSize('xxx-large'))
    } else {
      this.cookiesService.cookiesAllowed.set(this.storageService.get('cookiesAllowed'))
    }
    this.rememberMe()
  }

  rememberMe() {

    const userFromCookie: User = this.cookiesService.get('user')
    this.logger.info('in AppComponent.rememberMe', 'cookie content => ', userFromCookie);
    if ((userFromCookie) && userFromCookie.rememberMe) {
      this.signinSubscription = this.userService.signIn(new UserDto(userFromCookie)).subscribe({
        next: () => {
          this.infoBarService.buildInfoBar(new InfoBarBuilder(`Bienvenue ${userFromCookie.username?.toUpperCase()} !`).withIcon('mood'))
        },
        error: (error) => {
          this.logger.warn('Unable to connect user ', error)

        }
      })
      this.router.navigate(['home'])
    } else {
      this.logger.info('No cookie found for user or NO rememberMe')
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
        this.cookiesService.cookiesAllowed
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
