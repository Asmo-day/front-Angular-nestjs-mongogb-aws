import { SignInDto } from './signInDto';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from './user.service';
import { SnakebarService } from '../snakebar.service';
import { User } from './user';
import { CreateUserDto } from './createUserDto';
import { Router } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, CommonModule, MatCheckboxModule, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnDestroy {

  private _user = new BehaviorSubject<User>({} as any)
  public user$ = this._user.asObservable()

  private userService = inject(UserService)
  private snakeBar = inject(SnakebarService)
  private router = inject(Router)
  private passRegx: RegExp = /^(?=.*\W)(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
  private formBuilder = inject(FormBuilder)
  public isAccountCreation: boolean = false
  public creationOrCancelButton: string = "Créer un compte"
  public signInOrCreateButton: string = "Se connecter"
  public title: string = "Connection"
  public showPass: boolean = false
  public isSpinner: boolean = false
  public createUserForm = this.formBuilder.group({
    username: ['', Validators.required],
    firstName: [''],
    lastName: [''],
    email: [''],
    password: ['', [Validators.required, Validators.pattern(this.passRegx)]],
  });
  public signInForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', [Validators.required]],
  });
  private signinSubscription: Subscription = new Subscription();
  private createSubscription: Subscription = new Subscription();

  signIn() {
    if (this.signInForm.valid) {
      this.isSpinner = true
      let signInDto = new SignInDto(this.signInForm.value)
      this.signinSubscription = this.userService.signIn(signInDto).subscribe({
        next: (user: User) => {
          console.log(user);

          this.snakeBar.generateSnakebar('Hello !!', user.username.toUpperCase())
        },
        error: () => {
          this.isSpinner = false
          this.snakeBar.generateSnakebar('Une erreur est survenue', 'Utilisateur non trouvé')
        },
        complete: () => {
          this.isSpinner = false
          this.router.navigate(['/home']);
        }
      })
    }
  }

  createAccount() {
    if (this.createUserForm.valid) {
      this.isSpinner = true
      let userToCreate = new CreateUserDto(this.createUserForm.value);
      this.createSubscription = this.userService.createUser(userToCreate).subscribe({
        next: (data) => {
          this.snakeBar.generateSnakebar('Votre compte a été créé', 'Bienvenue ' + data.username.toUpperCase())
          // this.router.navigate(['/home'])
        },
        error: (data) => {
          let error: string;
          this.isSpinner = false
          if (data.status === 400) {
            console.warn(data.error.message);
            error = 'Le nom d\'utilisateur existe déjà'

          } else {
            console.warn('error during user creation ' + data);
            error = 'Une erreur est survenue'
          }
          this.snakeBar.generateSnakebar(`${error}`, 'Utilisateur non créer', undefined, 5000)
        },
        complete: () => {
          this.isSpinner = false
          this.toggleIsAccountCreation()
        }
      })
    }
  }

  async toggleIsAccountCreation() {
    this.isAccountCreation = !this.isAccountCreation
    this.title = this.isAccountCreation ? "Création de compte" : "Connexion"
    this.creationOrCancelButton = this.isAccountCreation ? "Annuler" : "Créer un compte"
    this.signInOrCreateButton = this.isAccountCreation ? "Créer" : "Se Connecter"
  }

  ngOnDestroy(): void {
    this.signinSubscription.unsubscribe()
    this.createSubscription.unsubscribe()
  }
}
