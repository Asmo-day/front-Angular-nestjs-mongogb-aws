import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../../shared/user.service';

@Component({
  selector: 'app-password-management',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatInputModule,],
  templateUrl: './password-management.component.html',
  styleUrl: './password-management.component.scss'
})
export class PasswordManagementComponent {

  public title: string = 'Changement de mot de passe'
  private userService = inject(UserService)
  private passRegx: RegExp = /^(?=.*\W)(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
  public showPass: boolean = false

}
