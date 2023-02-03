import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {tap} from "rxjs";
import {CookieService} from "ngx-cookie-service";
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient, private cookieService: CookieService, private router:Router) {}

  login(email: string, password: string) {
    return this.http.post('http://localhost:5000/auth/login', {email: email, password: password}).pipe(
      tap((response: any) => {
        this.cookieService.set('token', response.token);
        this.cookieService.set('ref_token', response.refreshToken);
        this.autoLogout(response.expirationDate);
      })
    )
  }

  autoLogout(expirationDate: number) {
    setTimeout(() => {
      console.log('Refresh Token')
      this.refreshToken(this.cookieService.get('ref_token')).subscribe();
      this.router.navigate(['/login']);
    }, expirationDate)
  }

  refreshToken(refreshToken: string) {
    return this.http.post(`${environment.API_URL}`, {token: refreshToken}).pipe(
      tap((response:any) => {
        this.cookieService.set('token', response.token);
        this.cookieService.set('ref_token', response.refreshToken);
      }, (error) => {
        this.cookieService.delete('token');
        this.cookieService.delete('ref_token');
        this.logout().subscribe();
      })
    )
  }

  logout() {
    return this.http.post(`${environment.API_URL}/auth/logout`, {token: this.cookieService.get('token'), refreshToken: this.cookieService.get('ref_token')}).pipe(
      tap(() => {
        this.cookieService.delete('token');
        this.cookieService.delete('ref_token');
      })
    );
  }
}
