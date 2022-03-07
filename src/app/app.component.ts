import { Component, OnInit } from '@angular/core';
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  title = 'angular-food-app';
  userRole: string = "";

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.checkIfUserIsValid();
  }

  checkIfUserIsValid() {
    if (this.authService.isUserLoggedIn() && this.userRole != "") {
      if (this.userRole != "STANDARD" &&
          this.userRole != "COURIER" &&
          this.userRole != "R_ADMINISTRATOR" &&
          this.authService.getRestaurantAdminRestaurantId() === 0 &&
          this.userRole != "ADMINISTRATOR") {
          alert("There is a problem with the current logged in user.\nPlease contact Administrator.\n\nLogging out..");
          this.authService.logout("/home");
      }
    } else if (!(this.authService.isUserLoggedIn()) && !(this.userRole === "")) {
      alert("There is a problem with the current user info.\nPlease contact Administrator.\n\nLogging out..");
      this.authService.logout("/home");
    }
  }

  isBasicUserOrNotLoggedIn(): boolean {
    if (this.userRole === "STANDARD" || this.userRole === "") {
      return true;
    }
    return false;
  }

  isCourier(): boolean {
    if (this.userRole === "COURIER") {
      return true;
    }
    return false;
  }

  isRestaurantAdmin(): boolean {
    if (this.userRole === "R_ADMINISTRATOR") {
      return true;
    }
    return false;
  }

  isSuperAdmin(): boolean {
    if (this.userRole === "ADMINISTRATOR") {
      return true;
    }
    return false;
  }

}
