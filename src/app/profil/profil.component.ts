import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../users/user.service';
import { User } from '../users/user';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss'
})

export class ProfilComponent implements OnInit {

  public title: string = 'Profil'
  public userService = inject(UserService)
  public user: User = this.userService.userSignal() as User
  public userSignal: any;

  ngOnInit(): void {
    this.userSignal = this.userService.userSignal
  }  


}
