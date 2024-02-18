import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpInterceptor } from './http-interceptor';
import { TokenService } from './token.service';
import { UserRouteAccessService } from './users/user-route-access.service';
import { UserService } from './users/user.service';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    UserService,
    UserRouteAccessService,
    TokenService,
    provideRouter(routes),
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    provideAnimations(),
    provideHttpClient(withInterceptors([
      httpInterceptor
    ])),
    provideAnimations(),
  ]
};
