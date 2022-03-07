import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginRegisterErrorResponse: string = "";

  constructor(private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  login(loginForm: NgForm) {
    
    this.loginRegisterErrorResponse = "";
    this.authService.login(loginForm.value).pipe(take(1)).subscribe({
      next: (response: any) => {
        loginForm.reset();
        this.authService.saveUserData(response);
        this.loginSuccess();
      },
      error: (error) => {
        if (error.status === 400) {
          this.loginRegisterErrorResponse = error.error.message;
        }
      }
    });
  }

  register(registerForm: NgForm) {

    this.loginRegisterErrorResponse = "";
    this.authService.register(registerForm.value).pipe(take(1)).subscribe({
      next: (response: any) => {
        alert(response);
        registerForm.reset();
        this.showHideRegister();
      },
      error: error => {
        if (error.status === 0) {
          this.loginRegisterErrorResponse = error.error.message;
        }
      }
    });
  }

  loginSuccess() {

    if (this.authService.getUserRole() === "STANDARD") {

      const hasRouterParams: boolean = this.route.snapshot.paramMap.has('redirectTo');

      if (hasRouterParams) {
        let goTo: string = this.route.snapshot.paramMap.get('redirectTo');
        this.router.navigate([`/${goTo}`]);
      } else {
        this.router.navigate(['/home']);
      }
    } else {
      window.location.href = environment.frontendUrl;
    }
  }

  showHideRegister() {

    this.loginRegisterErrorResponse = "";
    
    if (document.getElementById("loginCard").style.display == "none") {
      document.getElementById("loginCard").style.display = "flex";
      document.getElementById("registerCard").style.display = "none";
      let loginForm = <HTMLFormElement>document.getElementById("loginForm");
      loginForm.reset();
    } else {
      document.getElementById("loginCard").style.display = "none";
      document.getElementById("registerCard").style.display = "flex";
      let registerForm = <HTMLFormElement>document.getElementById("registerForm");
      registerForm.reset();
    }
  }

}
