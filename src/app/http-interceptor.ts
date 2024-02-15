import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from './token.service';
import { switchMap } from 'rxjs';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {

  const tokenService = inject(TokenService)

  return tokenService.getToken().pipe(
    switchMap(response => next(req.clone({
      headers: req.headers.set('Authorization', `Bearer ${response.token}`)
        .set('Content-Type', 'application/json')
    })))
  );
};
