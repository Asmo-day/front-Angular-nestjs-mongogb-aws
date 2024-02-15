import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpInterceptor } from './http-interceptor';
import { TokenService } from './token.service';
import { UserRouteAccessService } from './login/user-route-access.service';
import { UserService } from './login/user.service';

export const appConfig: ApplicationConfig = {
  providers: [
    UserService,
    UserRouteAccessService,
    TokenService,
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([
      httpInterceptor
    ])),
    provideAnimations(),
  ]
};
