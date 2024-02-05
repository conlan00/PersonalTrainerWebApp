import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MenuItem } from 'primeng/api';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { TestComponent } from '../test/test.component';
import { NavigationEnd, Router } from '@angular/router';
import { AccountService } from '../account/account.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss',
})
export class AdminPanelComponent implements OnInit {
  showDivs: boolean = true;

  constructor(public spinner: TestComponent, private router: Router,private accountService:AccountService) {

  }
  items: MenuItem[] | undefined;
  showFiller = false;
  ngOnInit() {
    this.spinner.startspinner();
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.showDivs = !event.url.includes('/admin/dashboard');
        }
      });
    
    this.items = [
      {
        label: 'Update',
        icon: 'pi pi-refresh'
      },
      {
        label: 'Delete',
        icon: 'pi pi-times'
      }
    ];
  }
  treningName = new FormControl('', [Validators.required]);
  imageUrl: string | ArrayBuffer | null = null;

  onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageUrl = e.target!.result as string; // Ręczne określenie, że e.target!.result nie jest undefined
      };

      reader.readAsDataURL(file);
    } else {
      this.imageUrl = null; // Ustawienie na null, gdy plik jest undefined
    }
  }
  handleClick(divId: string): void {
    console.log('Kliknięto ' + divId);
    if (divId === 'left-top') {
      this.spinner.startspinner();
      this.router.navigate(['/admin/dashboard']);
    }
    if (divId === 'right-top') {
      this.spinner.startspinner();
      this.router.navigate(['/admin/exercise']);
    }
    if (divId === 'left-bottom') {
      this.spinner.startspinner();
      this.router.navigate(['/admin/createtraining']);
    }
    if (divId === 'right-bottom') {
      this.spinner.startspinner();
      this.router.navigate(['/admin/plan']);
    }
  }
}
