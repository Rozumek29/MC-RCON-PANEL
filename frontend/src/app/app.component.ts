import { Component } from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private CookieService: CookieService, private router: Router) {
    if (this.CookieService.get('token') === "") {
      this.router.navigate(['/login']);
      return;
    }
  }
}
