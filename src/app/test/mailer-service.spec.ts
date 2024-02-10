import { MailerService } from './../mailer.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EmailDto } from '../emailDto';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { MailerServiceResponseData } from './mailer-service-response-data-mock';

describe('MailerService', () => {

  let mailerService: MailerService
  let result: any;

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        MailerService,
      ],
      imports: [HttpClientTestingModule]
    });
    TestBed.inject(HttpClient);
    mailerService = TestBed.inject(MailerService);
    jest.spyOn(mailerService.httpClient, 'post').mockReturnValue(of(MailerServiceResponseData));
  });

  it('should post en email', () => {
    mailerService.postEmailContent(new EmailDto).subscribe({
      next: data => {
        result = data;
      }
    })
    expect(mailerService.httpClient.post).toHaveBeenCalled();
    expect(result.accepted).toContain("delfrick2@gmail.com")
  })
});