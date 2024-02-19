import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from './token.service';
import { switchMap, tap } from 'rxjs';
import { CacheService } from './cache.service';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {

  const tokenService = inject(TokenService)
  const cacheService = inject(CacheService)
  const cachedToken = cacheService.get('token')

  if (cachedToken && cachedToken.exp > new Date().getTime() / 1000) {
    return next(req.clone({
      headers: req.headers.set('Authorization', `Bearer ${cachedToken.token}`)
        .set('Content-Type', 'application/json')
    }))
  } else {
    return tokenService.getToken().pipe(
      switchMap(response => next(req.clone({
        headers: req.headers.set('Authorization', `Bearer ${response.token}`)
          .set('Content-Type', 'application/json')
      })))
    )
  }
}
