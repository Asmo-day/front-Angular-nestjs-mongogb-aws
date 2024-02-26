import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpInterceptor } from './shared/http-interceptor';
import { TokenService } from './shared/token.service';
import { UserRouteAccessService } from './shared/user-route-access.service';
import { UserService } from './shared/user.service';
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

// export function tokenGetter() {
//   return localStorage.getItem("token");
// }
