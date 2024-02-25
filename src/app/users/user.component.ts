import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../shared/user.service';
import { SnakebarService } from '../shared/snakebar.service';
import { User } from './user';
import { UserDto } from './userDto';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatIconModule } from '@angular/material/icon';
import { Subscription, map } from 'rxjs';
import { CookiesService } from '../shared/cookies.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoggerService } from '../shared/logger.service';
import { SpinnerComponent } from '../shared/spinner/spinner.component';
import { MailerService } from '../shared/mailer.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, CommonModule, MatCheckboxModule, SpinnerComponent, MatIconModule, MatCheckboxModule, MatTooltipModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit, OnDestroy {

  public title: string = "Connexion";
  private cookiesService = inject(CookiesService);
  private snakeBar = inject(SnakebarService);
  private userService = inject(UserService);
  private mailerService = inject(MailerService);
  private route = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private logger = inject(LoggerService);
  private router = inject(Router);
  private passRegx: RegExp = /^(?=.*\W)(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
  public isAccountCreation: boolean = false;
  public creationOrCancelButton: string = "Créer un compte";
  public signInOrCreateButton: string = "Se connecter";
  public showPass: boolean = false;
  public isSpinner: boolean = false;
  public isUserAccountValidated: boolean = true;
  private signinSubscription: Subscription = new Subscription();
  private createSubscription: Subscription = new Subscription();
  private userValidationDataSubscription = new Subscription();
  public createUserForm = this.formBuilder.group({
    username: ['', Validators.required],
    firstName: [''],
    lastName: [''],
    email: ['', Validators.email],
    password: ['', [Validators.required, Validators.pattern(this.passRegx)]],
  });
  public signInForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
    rememberMe: [false]
  });
  private userValidationData = this.route.paramMap.pipe(
    map((params: ParamMap) => params.get('data'))
  );

  ngOnInit(): void {
    if (this.userValidationData) {
      this.validateUser()
    }
  }

  signIn() {
    if (this.signInForm.valid) {
      this.isSpinner = true
      const userDto = new UserDto(this.signInForm.value)
      this.signinSubscription = this.userService.signIn(userDto).subscribe({
        next: (user: any) => {
          if (user.isValidatedAccount) {
            let userForCookie = new User(user.id, user.username, '', '', user.email, user.role, user.userToken, user.rememberMe)
            this.cookiesService.set('user', userForCookie)
            this.snakeBar.generateSnakebar('Hello !!', user.username.toUpperCase())
            this.router.navigate(['/home']);
          } else {
            this.isUserAccountValidated = false
          }
        },
        error: (data) => {
          this.isSpinner = false
          this.logger.error('in UserComponent.signIn error: ', data)
          this.snakeBar.generateSnakebar('Une erreur est survenue', 'Utilisateur non trouvé')
        },
        complete: () => {
          this.isSpinner = false
        }
      })
    }
  }

  createAccount() {
    if (this.createUserForm.valid) {
      this.isSpinner = true
      const userToCreate = new UserDto(this.createUserForm.value);
      this.createSubscription = this.userService.createUser(userToCreate).subscribe({
        next: (data) => {
          this.snakeBar.generateSnakebar('Veuillez consulter votre boite e-mail', 'Bienvenue ' + data.username?.toUpperCase(), '', 5000)
          this.logger.info('in UserComponent.createAccount', data)
          Object.assign(userToCreate, { id: data._id })
          this.sendValidationEmail(userToCreate)
        },
        error: (data) => {
          let error: string;
          this.isSpinner = false
          if (data.status === 400) {
            this.logger.error('in UserComponent.createAccount error', data.status, data.error.message)
            error = 'Le nom d\'utilisateur existe déjà'
          } else {
            this.logger.error('in UserComponent.createAccount error ', data.status, data.error.message);
            error = 'Une erreur est survenue'
          }
          this.snakeBar.generateSnakebar(`${error}`, 'Utilisateur non créé', undefined, 5000)
        },
        complete: () => {
          this.isSpinner = false
          this.toggleIsAccountCreation()
        }
      })
    }
  }

  sendValidationEmail(userToValidate: UserDto) {
    console.log('in send validation email', userToValidate);
    this.mailerService.postValidationEmail(userToValidate).subscribe()
  }

  async toggleIsAccountCreation() {
    this.isAccountCreation = !this.isAccountCreation
    this.title = this.isAccountCreation ? "Création de compte" : "Connexion"
    this.creationOrCancelButton = this.isAccountCreation ? "Annuler" : "Créer un compte"
    this.signInOrCreateButton = this.isAccountCreation ? "Créer" : "Se Connecter"
  }

  validateUser() {
    this.isSpinner = true
    let id: string = '';
    let token: string = '';
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
    this.userService.validateUser(id, token).subscribe({
      next: (data) => { console.log(data) },
      error: (data) => {
        this.isSpinner = false
        this.logger.error('in UserComponent.validateUser error: ', data)
        this.snakeBar.generateSnakebar('Une erreur est survenue', 'L\'inscription n\'a pas été validé')
      },
      complete: () => {
        this.isSpinner = false
        this.snakeBar.generateSnakebar('Votre inscription a été validée', 'Connectez vous !!', '', 5000)
      }

    })
  }

  ngOnDestroy(): void {
    this.userValidationDataSubscription.unsubscribe()
    this.signinSubscription.unsubscribe()
    this.createSubscription.unsubscribe()
  }
}
