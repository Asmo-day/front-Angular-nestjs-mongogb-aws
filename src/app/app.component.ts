import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule, Validators, FormArray, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { EmailDto } from './emailDto';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule, MatButtonModule],
  templateUrl: './app.component.html',
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(private formBuilder: FormBuilder) { }

  emailForm = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.email],
    message: ['', Validators.required],
  });

  onSubmit() {
    let sendEmailDto = new EmailDto(this.emailForm.value)
    console.warn(sendEmailDto);
  }
}
