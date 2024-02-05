import { Component } from '@angular/core';
import { AccountService } from '../account/account.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private acc: AccountService) {
    /*console.log("sprawdzenie czy token ważny: "+acc.isTokenExpired())*/
  }
}
