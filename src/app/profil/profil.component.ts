import { Component, inject } from '@angular/core';
import { UserService } from '../users/user.service';
import { User } from '../users/user';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss'
})
export class ProfilComponent {


  public userService = inject(UserService)
  public user: User = this.userService.userSignal() as User


}
