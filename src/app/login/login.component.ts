import { SignInDto } from './signInDto';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from './user.service';
import { Snakebar } from '../snakebar.service';
import { User } from './user';
import { CreateUserDto } from './createUserDto';

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
  private passRegx: RegExp = /^(?=.*\W)(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
  private formBuilder = inject(FormBuilder)
  public isAccountCreation: boolean = false
  public creationOrCancelButton: string = "Créer un compte"
  public signInOrCreateButton: string = "Se connecter"
  public title: string = "Connection"
  createUserForm = this.formBuilder.group({
    username: ['', Validators.required],
    firstName: [''],
    lastName: [''],
    email: [''],
    password: ['', [Validators.required, Validators.pattern(this.passRegx)]],
  });

  signInForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', [Validators.required]],
  });

  signIn() {
    let signInDto = new SignInDto(this.signInForm.value)
    if (this.signInForm.valid) {
      this.userService.signIn(signInDto).subscribe({
        next: (data: User) => {
          this.snakeBar.generateSnakebar('Hello !!', data.username)
          // this.router.navigate(['email']);
        },
        error: () => {
          this.snakeBar.generateSnakebar('Une erreur est survenue', 'Utilisateur non trouvé')
        }
      })
    }
  }

  createAccount() {
    this.toggleIsAccountCreation()
    if (this.createUserForm.valid) {
      let userToCreate = new CreateUserDto(this.createUserForm.value);
      this.userService.createUser(userToCreate).subscribe({
        next: (data) => {
          console.log(data);
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
