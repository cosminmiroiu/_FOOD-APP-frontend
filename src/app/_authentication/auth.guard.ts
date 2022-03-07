import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,
    private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.authService.isUserLoggedIn()) {
      
      const allowedRole: string = route.data["role"] as string;

      if (this.authService.roleMatch(allowedRole)) {
        return true;
      } else {
        this.router.navigate(['/forbidden']);
        return false;
      }
    }
    this.router.navigate(["/login"]);
    return false;
  }

}
