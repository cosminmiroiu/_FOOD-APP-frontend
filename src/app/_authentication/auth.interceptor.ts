import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,
              private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.authService.isUserLoggedIn()) {

      const token = this.authService.getUserToken();

      if (token != "" && token != null) {
        request = this.addToken(request, token);
      } else {
        alert("Something is wrong with your session.\nPlease re-login.");
        this.authService.logout("/login");
        return EMPTY;
      }
    }

    // return next.handle(request);

    // filter errors
    return next.handle(request).pipe(
      catchError(
        (error: HttpErrorResponse) => {
          
          if(error.status === 401) {
            this.authService.logout("/login");
            alert("Authentication not valid. Please re-login.");
            return throwError(error);
          } else if (error.status === 403) {
            this.router.navigate(['/forbidden']);
            return throwError(error);
          } else if(error.status === 0 || error.status === 502) {
            alert("Server not responding.\n\n1. Check your internet connection\n2. Try to refresh the page.");
            return throwError(error);
          } else if (error.status === 400) {
            alert(error.error.message);
            return next.handle(request);
          }
         
          alert("Something is wrong. Try to reload the page.");
          console.log(error);
          return throwError(error);
        }
      )
    );

  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone(
      {
        setHeaders: {
          Authorization : `Bearer ${token}`
        }
      }
    );
  }

}
