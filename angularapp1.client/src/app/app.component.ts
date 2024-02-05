import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AccountService } from './account/account.service';
import { environment } from '../environments/environment.development';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TestComponent } from './test/test.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(private accountService: AccountService, private cookieService: CookieService, private spinner: TestComponent) { }
  ngOnInit(): void {
    //this.spinner.startspinner();
    localStorage.clear();

    this.refreshUser();
  }
  
  private refreshUser() {
    //const test = localStorage.getItem(environment.userKey);
    //const test = this.cookieService.get('JWT_token')
   // console.log("0!!!!!!!!!!!!!!!"+test)
    const jwt = this.accountService.getJWT();
    console.log("3."+jwt);
    if (jwt) {
      this.accountService.refreshUser(jwt).subscribe({
        next: _ => {},
        error: _ => {
          this.accountService.logout();
        }
      })
       
    } else {
      this.accountService.refreshUser(null).subscribe();
    }
  }
}
