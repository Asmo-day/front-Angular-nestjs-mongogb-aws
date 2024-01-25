import { CUSTOM_ELEMENTS_SCHEMA, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormGroup, FormControl, ReactiveFormsModule, Validators, FormArray, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { EmailDto } from './emailDto';
import { MailerService } from './mailer.service';

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

  
  constructor(
    private formBuilder: FormBuilder,
    private mailerService: MailerService
    ) { }

  emailForm = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', Validators.email],
    message: ['', Validators.required],
  });

  onSubmit() {
    let sendEmailDto = new EmailDto(this.emailForm.value)
    this.mailerService.postEmailContent(sendEmailDto).subscribe(response => {
      console.log(response);
      
    })
    console.warn(sendEmailDto);
  }
}
