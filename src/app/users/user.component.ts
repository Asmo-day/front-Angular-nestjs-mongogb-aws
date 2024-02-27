import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../shared/user.service';
import { SnakebarService } from '../shared/snakebar.service';
import { User } from './user';
import { UserDto } from './userDto';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
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
export class UserComponent implements OnDestroy {

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
  public creationOrCancelButton: string = "Créer un compte";
  public signInOrCreateButton: string = "Se connecter";
  public showPass: boolean = false;
  public isSpinner: boolean = false;
  public isAccountCreation: boolean = false;
  public isValidationEmailError: boolean = false;
  public isUserAccountValidated: boolean = true;
  public isEmailSentAgain: boolean = false;
  private signinSubscription: Subscription = new Subscription();
  private createSubscription: Subscription = new Subscription();
  private userValidationDataSubscription = new Subscription();
  public userToValidate: any;
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

  signIn() {
    if (this.signInForm.valid) {
      this.isSpinner = true
      const userDto = new UserDto(this.signInForm.value)
      this.signinSubscription = this.userService.signIn(userDto).subscribe({
        next: (user: User) => {
          if (user.isValidatedAccount) {
            const userForCookie = new UserDto(user) as User
            // remove userIcon to not store it in cookie
            userForCookie.userIcon = ''
            this.cookiesService.set('user', userForCookie)
            // this.snakeBar.generateSnakebar('Hello !!', user.username.toUpperCase())
            this.router.navigate(['/home']);
          } else {
            this.isUserAccountValidated = false
            this.userToValidate = user as UserDto
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

  sendValidationEmail(userToValidate?: UserDto) {
    if (userToValidate == null) {
      userToValidate = this.userToValidate
    }
    this.mailerService.postValidationEmail(userToValidate).subscribe({
      next: (data) => {
        this.isEmailSentAgain = true
        this.isValidationEmailError = false
      },
      error: (data) => {
        this.isValidationEmailError = true
        this.logger.error('Something went wrong during e-mail sending', data)
      }
    })
  }

  async toggleIsAccountCreation() {
    this.isAccountCreation = !this.isAccountCreation
    this.title = this.isAccountCreation ? "Création de compte" : "Connexion"
    this.creationOrCancelButton = this.isAccountCreation ? "Annuler" : "Créer un compte"
    this.signInOrCreateButton = this.isAccountCreation ? "Créer" : "Se Connecter"
  }

  ngOnDestroy(): void {
    this.userValidationDataSubscription.unsubscribe()
    this.signinSubscription.unsubscribe()
    this.createSubscription.unsubscribe()
  }
}
