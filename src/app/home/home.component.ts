import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterOutlet, RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import { InfoBarComponent } from '../shared/info-bar/info-bar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [CommonModule, RouterOutlet, RouterModule, MatMenuModule, RouterLink, MatButtonModule, RouterLinkActive, MatTabsModule, InfoBarComponent],
})
export class HomeComponent {

}
