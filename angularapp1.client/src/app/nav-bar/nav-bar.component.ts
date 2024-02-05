import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { Route, Router } from '@angular/router';
import { AccountService } from '../account/account.service';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { ItemsService } from '../items/items.service';
import { TestComponent } from '../test/test.component';
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
/*
  przekierujDoNowejStrony(): void {
    window.location.href = '/account/login';
  }*/

  constructor(public accountService: AccountService, private router: Router,
    public itemService: ItemsService, public spinner: TestComponent) { }

  logout() {
    this.accountService.logout().subscribe(
      (loggedIn: boolean)=>{
        this.accountService.loggedIn = false;
        this.router.navigateByUrl('/');
    });
  }




}
