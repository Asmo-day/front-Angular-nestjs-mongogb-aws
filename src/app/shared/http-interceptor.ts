import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from './token.service';
import { switchMap } from 'rxjs';
import { StorageService } from './storage.service';
// import { Token } from './token';
import { JwtHelperService } from '@auth0/angular-jwt';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {

  const tokenService = inject(TokenService)
  const storageService = inject(StorageService)
  const cachedToken = storageService.get('token')
  const jwtHelper = new JwtHelperService()

  if (cachedToken && !jwtHelper.isTokenExpired(cachedToken)) {
    return next(req.clone({
      headers: req.headers.set('Authorization', `Bearer ${cachedToken}`)
        .set('Content-Type', 'application/json')
    }))
  } else {
    return tokenService.getToken().pipe(
      switchMap(token => next(req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'application/json')
      })))
    )
  }
}