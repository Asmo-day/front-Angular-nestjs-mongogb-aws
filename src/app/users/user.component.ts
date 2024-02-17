import { SignInDto } from './signInDto';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from './user.service';
import { Snakebar } from '../snakebar.service';
import { User } from './user';
import { CreateUserDto } from './createUserDto';
import { Router } from '@angular/router';
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  providers: [UserService],
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, CommonModule, MatCheckboxModule, FormsModule, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {

  private userService = inject(UserService)
  private snakeBar = inject(Snakebar)
  private router = inject(Router)
  private passRegx: RegExp = /^(?=.*\W)(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
  private formBuilder = inject(FormBuilder)
  public isAccountCreation: boolean = false
  public creationOrCancelButton: string = "Créer un compte"
  public signInOrCreateButton: string = "Se connecter"
  public title: string = "Connection"
  public showPass: boolean = false
  public isSpinner: boolean = false
  public userSignal = signal<User>;
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

  signIn() {
    if (this.signInForm.valid) {
      this.isSpinner = true
      let signInDto = new SignInDto(this.signInForm.value)
      this.userService.signIn(signInDto).subscribe({
        next: (user: User) => {

          console.log(user);

          this.userSignal.set(user)
          
          this.snakeBar.generateSnakebar('Hello !!', user.username.toUpperCase())
        },
        error: () => {
          this.isSpinner = false
          this.snakeBar.generateSnakebar('Une erreur est survenue', 'Utilisateur non trouvé')
        },
        complete: () => {
          this.isSpinner = false
          this.router.navigate(['email']);
        }
      })
    }
  }

  createAccount() {
    if (this.createUserForm.valid) {
      this.isSpinner = true
      let userToCreate = new CreateUserDto(this.createUserForm.value);
      this.userService.createUser(userToCreate).subscribe({
        next: (data) => {
          this.snakeBar.generateSnakebar('Ton compte a été créé', 'Bienvenue ' + data.username.toUpperCase())
        },
        error: (data) => {
          this.isSpinner = false
          console.warn('error during user creation ' + data);
          this.snakeBar.generateSnakebar('Une erreur est survenue', 'Utilisateur non créer')
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
}
