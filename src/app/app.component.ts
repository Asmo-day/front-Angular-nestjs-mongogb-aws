import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule, RouterOutlet, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, MatMenuModule, RouterLink, MatButtonModule, RouterLinkActive, MatTabsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class AppComponent {

}
