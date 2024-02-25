import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MailerService } from '../shared/mailer.service';
import { MailerServiceResponseData } from './mailer-service-response-data-mock';
import { EmailDto } from '../email/emailDto';

describe('MailerService', () => {
  let service: MailerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MailerService],
    });

    service = TestBed.inject(MailerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should make a POST request', () => {

    service.postEmailContent(new EmailDto).subscribe(response => {
      expect(response).toContain('delfrick');
    });

    const req = httpMock.expectOne('http://localhost:3000/email');
    expect(req.request.method).toBe('POST');
    req.flush(MailerServiceResponseData);
  });
});