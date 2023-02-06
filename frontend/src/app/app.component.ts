import {Component, OnInit} from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{

  constructor(private CookieService: CookieService, private router: Router, private translate: TranslateService) {
    this.translate.addLangs(['en', 'pl']);
    this.translate.setDefaultLang(navigator.language);
    if (this.CookieService.get('token') === "") {
      this.router.navigate(['/login']);
      return;
    }
  }
}
