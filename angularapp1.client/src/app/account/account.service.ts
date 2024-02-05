import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Register } from '../models/register';
import { environment } from '../../environments/environment.development';
import { NotificationComponent } from '../modals/notification/notification.component';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Login } from '../models/login';
import { User } from '../models/User';
import { Observable, ReplaySubject, map, of } from 'rxjs';
import {  Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { ConfirmEmail } from '../models/ConfirmEmail';
import { ResetPassword } from '../models/ResetPassword';
import { AdminPanelService } from '../admin-panel/admin-panel.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private userSource = new ReplaySubject<User | null>(1);
  user$ = this.userSource.asObservable();
  bsModalRef?: BsModalRef;
  private path = environment.appUrl;
  loggedIn = false;

  constructor(private http: HttpClient, private modalService: BsModalService, private router: Router,
    private cookieService: CookieService,private adminService:AdminPanelService) {
    




  }
  showNotification(isSuccess: boolean, title: string, message: string) {
    const initialState: ModalOptions = {
      initialState: {
        isSuccess,
        title,
        message

      }

    };
    this.bsModalRef = this.modalService.show(NotificationComponent, initialState);
  }
  refreshUser(jwt: string | null) {
  ///  console.log("4.refreshopwanie ")
  //  console.log(jwt);
    if (jwt === null) {
      this.userSource.next(null);
      return of(undefined);
    }
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);
  //  console.log("header!!!!!!!!!!!!!!!!" + headers);
    return this.http.get<User>(`${environment.appUrl}/api/account/refresh-user-token`,
      {headers}).pipe(
      map((user: User) => {
        if (user) {
          this.setUser(user);
        }
      })
    )
  }
  login(model: Login) {
    const header = new HttpHeaders().set('Content-type', 'application/json');
    return this.http.post<User>(`${environment.appUrl}/api/account/login`, model, {headers:header, withCredentials:true });
  }
  LoginWithGoogle(credential: string): Observable<any> {
    const header = new HttpHeaders().set('Content-type', 'application/json');
    return this.http.post(`${environment.appUrl}/api/account/LoginWithGoogle`, JSON.stringify(credential), { headers: header, withCredentials:true });
  }
  logout():Observable<any> {
    const header = new HttpHeaders().set('Content-type', 'application/json');
    return this.http.get(`${environment.appUrl}/api/account/logout`,  { headers: header, withCredentials: true });
  }
  register(model: Register) {
    return this.http.post(`${environment.appUrl}/api/account/register`, model);
  }
  getJWT() {
    const key = this.cookieService.get('JWT_token');
   console.log("1.key" + key);
    if (key) {
      //const user: User = JSON.parse(key);
   //   console.log("2.jwt" + user.jwt);
      return key;
    } else {
      return null;
    }
  }
  private setUser(user: User) {
    //localStorage.setItem(environment.userKey, JSON.stringify(user));
/*    this.cookieService.set('JWT_token', `${user.jwt}`,
            undefined, '/', undefined, true, 'Strict')*/
    //console.log("porefreshu");
   // console.log(environment.userKey);
   // console.log(JSON.stringify(user));

    this.userSource.next(user);
  /*  this.user$.subscribe({
      next: response => console.log(response)
      //dostep do danych uzytkownika
    })
*/
  }
/*   isTokenExpired(): boolean {
    const token = this.cookieService.get('JWT_token');
    const decodedToken = this.decodeToken(token);

    if (!decodedToken || !decodedToken.exp) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);

    return decodedToken.exp < currentTime;
  }

  private decodeToken(token: string): any {
    try {
      const decoded = jwtDecode(token);
      return decoded;
    } catch (error) {
      return null;
    }
  }*/

  refreshTokenInterceptor(): Observable<any>{
    const header = new HttpHeaders().set('Content-type', 'application/json');
    const refreshTokenEndpoint = `${environment.appUrl}/api/account/refresh`;
    return this.http.get(refreshTokenEndpoint, { headers: header, withCredentials: true } );
  }

  revokeToken(): Observable<any> {
    const header = new HttpHeaders().set('Content-type', 'application/json');
    const revokeTokenEndpoint = `${environment.appUrl}/api/account/revoke`;
    return this.http.delete(revokeTokenEndpoint,{ headers: header, withCredentials: true });
  }
  getZasoby(): Observable<any> {
    const header = new HttpHeaders().set('Content-type', 'application/json');
    return this.http.get(`${environment.appUrl}/api/account/zasoby`, { headers: header, withCredentials: true });
  }
  checkLoginStatus(): Observable<any> {
    const header = new HttpHeaders().set('Content-type', 'application/json');
    return this.http.get(`${environment.appUrl}/api/account/check_login`, { headers: header, withCredentials: true });
  }
  confirmEmail(model: ConfirmEmail) {
    return this.http.put(`${environment.appUrl}/api/account/confirm-email`, model);
  }
  resendEmailConfirmationLink(email: string) {
    return this.http.post(`${environment.appUrl}/api/account/resend-email-confirmation-link/${email}`, {})
  }
  forgotUsernameOrPassword(email: string) {
    return this.http.post(`${environment.appUrl}/api/account/forgot-username-or-password/${email}`, {})
  }
  resetPassowrd(model:ResetPassword) {
    return this.http.put(`${environment.appUrl}/api/account/reset-password`, model);
  }
  loadUserRole(): Observable<any> {
    const header = new HttpHeaders().set('Content-type', 'application/json');
    return this.http.get<any>(`${environment.appUrl}/api/account/getRole`, { headers: header, withCredentials: true });
  }
  userRoles: string[] = [];

  async getRole(): Promise<void> {
    try {
      const roles = await this.loadUserRole().toPromise();
      this.userRoles = [roles.value.rola];
    } catch (error) {
      console.error(`Błąd podczas pobierania roli użytkownika`, error);
    }
  }

  hasRole(role: string): boolean {
    return this.userRoles.includes(role);
  }
  

}
