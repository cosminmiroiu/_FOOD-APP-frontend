import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  loggedIn: boolean = false;

  constructor(private userService: AuthService) { }

  ngOnInit(): void {
    this.updateLoginStatus();
  }

  updateLoginStatus() {
    this.userService.loggedIn.subscribe(
      result => {
        this.loggedIn = result;
      }
    );
  }

  logout() {
    this.userService.logout("/home");
  }

}
