import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account/account.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent  {
  constructor(private http:HttpClient,private accountService: AccountService, private cookieService: CookieService) {
  }

 /* ngOnInit(): void {
    this.refreshAndSetToken();
  }*/
/*  refreshAndSetToken(): void {
    const refreshToken = this.cookieService.get('JWT_token');

    this.accountService.refreshToken(refreshToken)
      .subscribe(response => {
        console.log('Nowy token:', response);
      },
        (error) => {
          console.error('Błąd odświeżania tokena:', error);
        }
      );
  }*/
  getZasoby() {
    this.accountService.getZasoby().subscribe(
      (response) => {
        console.log('Zasoby:', response);
      },
      (error) => {
        console.error('Błąd pobierania zasobów:', error);
      }
    );
  }
}
