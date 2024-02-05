import { Injectable, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from './account/account.service';
import { environment } from '../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private accountService: AccountService, private http: HttpClient,private router:Router) { }
  


  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise < boolean | UrlTree > {
      await this.accountService.getRole(); 

      const allowedRoles = (next.data['roles'] as string[]) || [];

      if(allowedRoles && allowedRoles.length > 0) {
      const hasRequiredRole = allowedRoles.some((role) => this.accountService.hasRole(role));

        if (!hasRequiredRole) {
          console.log('Brak wymaganej roli');
          this.accountService.logout().subscribe({
            next: (loggedIn: boolean) => {
              this.accountService.loggedIn = loggedIn;

            },
            error: (error: any) => {
              this.router.navigateByUrl("/account/login");



            }
          });
        
          return false;
      }
    }

    return true;
  }
 
}
