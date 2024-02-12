import { HttpClient, HttpHeaders, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { map, switchMap, tap } from 'rxjs';
import { TokenService } from './token.service';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {

  console.log(req);
  

  let headerWithToken: any;
  const tokenService = inject(TokenService)
  tokenService.getToken().subscribe(response => {
    console.log(response);
    
    // switchMap(() => token = response.token)
    headerWithToken = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${response.token}`)
    })
  });
  // console.log('################### ' + token);
  


  return next(headerWithToken);
};
