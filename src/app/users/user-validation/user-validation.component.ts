import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { map } from 'rxjs';
import { UserService } from '../../shared/user.service';
import { LoggerService } from '../../shared/logger.service';
import { SnakebarService } from '../../shared/snakebar.service';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-validation',
  standalone: true,
  imports: [RouterLinkActive, RouterLink, MatButtonModule],
  templateUrl: './user-validation.component.html',
  styleUrl: './user-validation.component.scss'
})
export class UserValidationComponent implements OnInit {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  public isValidated: boolean = false;
  public isLoading: boolean = true;
  private logger = inject(LoggerService);
  private snakeBar = inject(SnakebarService);
  private userValidationData = this.route.paramMap.pipe(
    map((params: ParamMap) => params.get('data'))
  );

  ngOnInit(): void {
    this.validateUser()
  }

  validateUser() {
    console.log('calidateUser');

    let id: string = '';
    let token: string = '';
    // extract data from url
    this.userValidationData.subscribe({
      next: (data) => {
        console.log(data);
        if (data) {
          let dataSplit: string[] = data.split('@')
          id = dataSplit[0]
          token = dataSplit[1]
        } else {
          this.logger.error('Unable to retrieve data for Validation')
          this.snakeBar.generateSnakebar('Une erreur est survenue', 'Validation impossible')
        }
      }
    })
    setTimeout(() => {
      
      // call back end to validate user
      this.userService.validateUser(id, token).subscribe({
        next: (data) => { 
        this.isLoading =false
        this.isValidated = true
      },
      error: (data) => {
        this.isLoading =false
        this.logger.error('in UserComponent.validateUser error: ', data)
        this.snakeBar.generateSnakebar('Une erreur est survenue', 'L\'inscription n\'a pas été validé')
      },
    })
    
  }, 5000);
  }

  continue() {
    this.router.navigate(['user'])
  }

}
