import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { UserService } from './user.service';
import { Transaction } from '../models/BusinessModels/Transaction';
import { BusinessItem } from '../models/BusinessModels/BusinessItem';
import { BusinessUser } from '../models/BusinessModels/BusinessUser';
import { BusinessTraining } from '../models/BusinessModels/BusinessTraining';
import { CommonModule } from '@angular/common';
import { ItemsService } from '../items/items.service';
import { AccountService } from '../account/account.service';
import { Router } from '@angular/router';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit{
  transactions: Transaction[] = [];
  items: BusinessItem[] = [];
  lotsOfTabs: string[] = [];
  training: BusinessTraining[] = [];
  imageUrls: string[] = [];
  constructor(private userService: UserService, private itemsService: ItemsService,
    private accountService: AccountService,private router:Router) { }
    ngOnInit(): void {
      this.userService.getTransaction().subscribe((response) => {
        this.transactions = this.mapTransactionsToDTO(response);
        console.log('Transackej:', this.transactions);
        this.items=this.transactions.map(transaction => transaction.item);
        console.log('First transaction days:', this.transactions[0]?.item?.days);
        this.lotsOfTabs = new Array(this.transactions[0]?.item?.days || 20)
          .fill(0).map((_, index) => `Day ${index + 1}`);
        console.log("czy pusta tablica ", this.items);

        this.items.forEach((item, index) => {
          this.itemsService.downloadFile(item.name + ".jpg").subscribe(
            (data) => {
              console.log("zdjecie", data)
              // Utwórz URL dla pobranego pliku i przypisz go do tablicy imageUrls
              const imageUrl = window.URL.createObjectURL(data);
              this.imageUrls[index] = imageUrl;
            },
            (error) => {
              console.error(`Error downloading image for item ${item.name}`, error);
            }
          );
        });









      })
      this.userService.getTraining().subscribe((response) => {
        this.training = this.mapTrainingToDTO(response);
        console.log('trening: ', this.training);

      })
      this.accountService.checkLoginStatus().subscribe({
        next: (response: any) => {
          if (response) {
            this.accountService.loggedIn = true;
          }
          
        },
        error: (error:any) => {
          if (error.error.errors) {
           
          } else {
            
          }
        }
      })
    }

  //lotsOfTabs = new Array(this.transactions[0]?.item?.days || 20).fill(0).map((_, index) => `Day ${index + 1}`);
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  displayedColumns1: string[] = ['exerciseName'];
  dataSource = ELEMENT_DATA;

  private mapTransactionsToDTO(transactions: any[]): Transaction[] {
   
    return transactions.map(tran => ({
      isPaid: tran.isPaid,
      emailUser: tran.emailUser,
      item: this.mapItem(tran.item),  // Map 'item' property
      user: this.mapUser(tran.user)   // Map 'user' property
      
    }));
  }

  private mapItem(item: any): BusinessItem {
    return {
      name: item.name,
      price: item.price,
      days: item.days
    };
  }

  private mapUser(user: any): BusinessUser {
    return {
      name: user.name,
      surname: user.surname
    };
  }
  private mapTrainingToDTO(training: any[]): BusinessTraining[] {
    return training.map(training => ({
      exerciseName: training.exerciseName,
      dayOfWeek: training.dayOfWeek,
    }));
  }
  getExercisesForDay(day: number): BusinessTraining[] {
    return this.training.filter(training => training.dayOfWeek === day);
  }
}
