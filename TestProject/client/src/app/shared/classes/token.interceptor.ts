import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

function handleAuthError(error: HttpErrorResponse, router: Router): Observable<never> {

  if (error.status === 401) {
    
    router.navigate(['/login'], { queryParams: { sessionFailed: true } });
  }

  return throwError(() => error);
}

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('auth-token');

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: token
      }
    });
  } else {
    console.log('❌ Токен отсутствует');
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => handleAuthError(error, router))
  );
};
