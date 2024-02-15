import { SignInDto } from './signInDto';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from './login.service';
import { Snakebar } from '../snakebar.service';
import { User } from './user';
import { Router } from '@angular/router';
import { NONE_TYPE } from '@angular/compiler';

@Component({
  selector: 'app-login',
  standalone: true,
  providers: [UserService],
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private userService = inject(UserService)
  private snakeBar = inject(Snakebar)
  private router = inject(Router)
  private passRegx: RegExp = /^(?=.*\W)(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
  private formBuilder = inject(FormBuilder)
  public isAccountCreation: boolean = false
  public creationOrCancelButton: string = "Créer un compte"
  public signInOrCreateButton: string = "Se connecter"
  public title: string = "Connection"

  signInForm = this.formBuilder.group({
    username: ['', Validators.required],
    firstName: [''],
    lastName: [''],
    email: [''],
    password: ['', [Validators.required, Validators.pattern(this.passRegx)]],

  });

  signIn() {
    let singInDto = new SignInDto(this.signInForm.value)
    if (this.signInForm.valid) {
      this.userService.signIn(singInDto).subscribe({
        next: (data: User) => {
          this.snakeBar.generateSnakebar('Hello !!', data.username)
          this.router.navigate(['/email']);
        },
        error: () => {
          this.snakeBar.generateSnakebar('Une erreur est survenue', 'Utilisateur non trouvé')
        }
      })
    }

  }
  createAccount() {
    this.toggleIsAccountCreation()
    this.
      console.log('in create account');
    // this.router.navigate(['/createAccount'])
  }

  toggleIsAccountCreation() {
    this.isAccountCreation = this.isAccountCreation ? false : true
    this.title = this.isAccountCreation ? "Création de compte" : "Connexion"
    this.creationOrCancelButton = this.isAccountCreation ? "Annuler" : "Créer un compte"
    this.signInOrCreateButton = this.isAccountCreation ? "Créer" : "Se Connecter"
  }

}
