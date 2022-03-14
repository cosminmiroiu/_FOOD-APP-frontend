import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoggedInResponse as LoginResponse } from '../entity/login-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: LoginResponse = null;
  loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private httpClient: HttpClient,
              private router: Router) {

    // load user data from local storage
    this.loadUserData();
  }

  loadUserData() {
    let data = JSON.parse(localStorage.getItem('userData'));

    if (data != null) {
      this.userData = data;
      let now: Date = new Date();
      let expirationDate: Date = new Date(this.userData.expirationDate);

      if (expirationDate > now) {
        this.loggedIn.next(true);
        this.autoLogout(expirationDate.getTime() - now.getTime());
      } else {
        alert("Authentication session expired.\nPlease re-login.")
        this.logout('/login');
      }
    }
  }

  saveUserData(userDataResponse: LoginResponse) {
    localStorage.setItem("userData", JSON.stringify(userDataResponse));
    this.userData = userDataResponse;

    let now: Date = new Date();
    let expirationDate: Date = new Date(this.userData.expirationDate);

    if (expirationDate > now) {
      this.loggedIn.next(true);
      this.autoLogout(expirationDate.getTime() - now.getTime());
    } else {
      alert("There was a problem with your login process.\nPlease retry.");
      this.logout('/login');
    }
  }

  login(loginData: any) {
    const loginUrl = `${environment.backendUrl}/login`;
    return this.httpClient.post(loginUrl, loginData);
  }

  register(registerData: any) {
    const registerUrl = `${environment.backendUrl}/register`;
    return this.httpClient.post(registerUrl, registerData, {responseType: 'text'});
  }

  logout(redirectTo: string) {
    localStorage.removeItem("userData");
    this.userData = null;
    this.loggedIn.next(false);
    if (redirectTo != "") {
      this.router.navigate([redirectTo]);
    }
  }

  autoLogout(expirationTimeValue: number) {
    setTimeout(() => {
      alert("Authentication session expired.\nPlease relogin.");
      this.logout('/login');
    }, expirationTimeValue);
  }

  isUserLoggedIn(): boolean {
    return this.loggedIn.getValue();
  }

  roleMatch(allowedRole: string): boolean {
    const userRole: string = this.getUserRole();

    if (userRole === allowedRole) {
      return true;
    } else {
      return false;
    }
  }

  getUserId(): number {
    if (this.userData != null) {
      return this.userData.user.id;
    } else {
      return 0;
    }
  }

  getRestaurantAdminRestaurantId(): number {
    if (this.userData != null) {
      return this.userData.user.role.restaurantId;
    } else {
      return 0;
    }
  }

  getUserRole(): string {
    if (this.userData != null) {
      return this.userData.user.role.roleName;
    } else {
      return "";
    }
  }

  getUserEmail(): string {
    if (this.userData != null) {
      return this.userData.user.email;
    } else {
      return "";
    }
  }

  getUserToken(): string {
    if (this.userData != null) {
      return this.userData.jwtToken;
    } else {
      return "";
    }
  }

  getUserFullName(): string {
    if (this.userData != null) {
      return `${this.userData.user.firstName} ${this.userData.user.lastName}`;
    } else {
      return "";
    }
  }

  getUserFirstName(): string {
    if (this.userData != null) {
      return `${this.userData.user.firstName}`;
    } else {
      return "";
    }
  }

  getUserAddress(): string {
    if (this.userData != null) {
      return `${this.userData.user.address}`;
    } else {
      return "";
    }
  }

  getUserPhoneNumber(): string {
    if (this.userData != null) {
      return `${this.userData.user.phone}`;
    } else {
      return "";
    }
  }

}
