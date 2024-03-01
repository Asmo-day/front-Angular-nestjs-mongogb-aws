import { Component, effect, inject } from '@angular/core';
import { InfoBarService } from './info-bar.service';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../user.service';

export const InfoBarAnimation = trigger('slideBar', [
  transition(':enter', [
    style({ transform: 'translateX(100%)' }),
    animate('500ms ease-out', style({ transform: 'translateX(0)' })),
  ]),
  transition(":leave", [
    animate('500ms ease-out', style({ transform: 'translateX(100%)' })),
  ])
]);

@Component({
  selector: 'app-info-bar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './info-bar.component.html',
  styleUrl: './info-bar.component.scss',
  animations: [
    InfoBarAnimation
  ]
})
export class InfoBarComponent {

  public infoBarService = inject(InfoBarService)
  public userService = inject(UserService)

  constructor() {
    console.log(this.infoBarService.triggerInfoBar());
    effect(() => {
      this.infoBarService.triggerInfoBar
    })
  }

  cookiesAllowed(isCookiesAllowed: boolean) {
    this.userService.isCookiesAllowed.set(isCookiesAllowed)
  }

}


