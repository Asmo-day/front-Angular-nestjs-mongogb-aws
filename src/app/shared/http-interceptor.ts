import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from './token.service';
import { switchMap, tap } from 'rxjs';
import { StorageService } from './storage.service';
import { LoggerService } from './logger.service';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {

  const tokenService = inject(TokenService)
  const storageService = inject(StorageService)
  const logger = inject(LoggerService);
  const cachedToken = storageService.get('token')
  const splitToken = cachedToken ? JSON.parse(atob(storageService.get('token').split('.')[1])) : '';

  if (cachedToken && splitToken.exp > new Date().getTime() / 1000) {
    logger.info('in httpInterceptor Get token from localStorage', 'token will expires at: ', new Date(splitToken.exp * 1000));
    
    return next(req.clone({
      headers: req.headers.set('Authorization', `Bearer ${cachedToken}`)
        .set('Content-Type', 'application/json')
    }))
  } else {
    return tokenService.getToken().pipe(
      tap(() => logger.info('in httpInterceptor Get token from back-end')
      ),
      switchMap(token => next(req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
          .set('Content-Type', 'application/json')
      })))
    )
  }
}