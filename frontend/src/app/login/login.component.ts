import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/authService";
import {FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {tap} from "rxjs";
import {Router} from "@angular/router";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  errorMessage: string;
  formModel: Partial<any>;

  constructor(private authService: AuthService, private router: Router, private cookieService: CookieService) {
    this.errorMessage = "";
    this.formModel = {email: "", password: ""};
  }

  ngOnInit() {
    if (this.cookieService.get('token')) {
      this.router.navigate(['/dashboard']);
    }
  }

  login() {
    if (this.formModel['email'].length === 0 || this.formModel['password'].length === 0) {
      this.errorMessage = "Please fill in all fields";
      return;
    }
    this.authService.login(this.formModel['email'], this.formModel['password']).subscribe({
      next: () => {
        this.errorMessage = "";
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = err.error.message ? err.error.message : "Internal server error"
        console.log(err)
      }
    });
  }

}
