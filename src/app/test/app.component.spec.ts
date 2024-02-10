import { TestBed } from '@angular/core/testing';
import { AppComponent } from '../app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MailerService } from '../mailer.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { MailerServiceResponseData } from './mailer-service-response-data-mock';

describe('AppComponent', () => {

  let mailerServiceMock: ReturnType<jest.Mock>

  beforeEach(() => {

    mailerServiceMock = {
      postEmailContent: jest.fn(() => {
        return of(MailerServiceResponseData)
      })
    }

    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, HttpClientTestingModule]
    }).compileComponents();

    TestBed.overrideComponent(AppComponent, {
      set: {
        providers: [
          {
            provide: MailerService,
            useValue: mailerServiceMock
          },
        ]
      }
    })
  });

  it('should create the app', () => {
    const app: AppComponent = generateApp();
    expect(app).toBeTruthy();
  });

  it('should render send button', () => {
    const htmlElement: HTMLElement = generateHtmlElement();
    expect(htmlElement.querySelector('button')?.textContent).toContain('Envoyer');
  });

  it('should submit form with success', () => {
    const app: AppComponent = generateApp();
    const waitDialog = jest.spyOn(app, 'waitDialog');
    const snakebar = jest.spyOn(app.snakeBar, 'generateSnakebar');
    const matDialog = jest.spyOn(app.dialog, 'open');
    app.onSubmit();
    expect(mailerServiceMock.postEmailContent).toHaveBeenCalled();
    expect(waitDialog).toHaveBeenCalled();
    expect(snakebar).toHaveBeenCalled();
    expect(matDialog).toHaveBeenCalled();

  })
  it('should submit form with error', () => {
    const app: AppComponent = generateApp();
    const mockCall = jest.spyOn(mailerServiceMock, 'postEmailContent').mockReturnValue(throwError(() => new Error()));
    app.onSubmit();
    expect(mailerServiceMock.postEmailContent).toHaveBeenCalled();

  })
});


function generateApp() {
  return TestBed.createComponent(AppComponent).componentInstance;
}

function generateHtmlElement() {
  return TestBed.createComponent(AppComponent).nativeElement as HTMLElement;
}

