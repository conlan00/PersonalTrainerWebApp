import { Component, OnInit } from '@angular/core';
import { ItemsService } from './items.service';
import { Item } from '../models/item';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrl: './items.component.css'
})
export class ItemsComponent implements OnInit {
  items: Item[] = [];
  imageUrls: string[] = [];
  constructor(private itemsService: ItemsService) {
  }
    ngOnInit(): void {
      this.itemsService.getItems().subscribe((response) => {
        this.items = this.itemsService.mapItemsToDTO(response);
        console.log('Itemsy:', this.items);
        this.items.forEach((item, index) => {
          this.itemsService.downloadFile(item.name+".jpg").subscribe(
            (data) => {
              console.log("zdjecie",data)
        
              const imageUrl = window.URL.createObjectURL(data);
              this.imageUrls[index] = imageUrl;
            },
            (error) => {
              console.error(`Error downloading image for item ${item.name}`, error);
            }
          );
        });
      });
    }

  




  buyNow(url:any,product: any): void {
    //console.log(`Buying ${product.name} now!`);
    //czyszczenie local storage
    localStorage.clear();
    localStorage.setItem("Item", product.name);
    localStorage.setItem("Price", product.price);
    localStorage.setItem("Url", url);
    // Add your logic for "Buy Now" action
  }

  addToCart(product: any): void {
    console.log(`Adding ${product.name} to the cart!`);
    localStorage.setItem(product.name, product.price);
    this.itemsService.numberOfItems++;
    if (this.itemsService.numberOfItems > 0) {
      this.itemsService.hidden = false;
    }
    else {
      this.itemsService.hidden = true;
    }
   
    // Add your logic for "Add to Cart" action
  }
/*  private mapItemsToDTO(items: any[]): Item[] {
    return items.map(item => ({
      name: item.name,
      price: item.price,
    }));
  }*/
}
