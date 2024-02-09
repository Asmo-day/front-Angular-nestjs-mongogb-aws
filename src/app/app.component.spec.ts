import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MailerService } from './mailer.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AppComponent', () => {

  // let mailerServiceMock!: { postEmailContent: jest.Mock };

  beforeEach(async () => {
    // mailerServiceMock = {
    //   postEmailContent: jest.fn(),
    // };
    await TestBed.configureTestingModule({
      // providers: [
      //   {
      //     provide: MailerService,
      //     useValue: mailerServiceMock, // uses the mock
      //   },
      // ],
  imports: [NoopAnimationsModule, HttpClientTestingModule]
    }).compileComponents();
  });

  it('should create the app', () => {
    const app: AppComponent = generateApp();
    expect(app).toBeTruthy();
  });

  it(`should have the 'angular' title`, () => {
    const app = generateApp();
    expect(app.title).toEqual('angular');
  });

  it('should render send button', () => {
    const htmlElement: HTMLElement = generateHtmlElement();
    expect(htmlElement.querySelector('button')?.textContent).toContain('Envoyer');
  });
});

function generateApp() {
  return TestBed.createComponent(AppComponent).componentInstance;
}

function generateHtmlElement() {
  return TestBed.createComponent(AppComponent).nativeElement as HTMLElement;
}

