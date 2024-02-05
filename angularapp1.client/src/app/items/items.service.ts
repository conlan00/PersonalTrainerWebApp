import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { NewItem } from '../models/BusinessModels/NewItem';
import { Item } from '../models/item';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  numberOfItems  = 0;
  hidden = true;
  constructor(private http: HttpClient) { }

  getItems():Observable<any> {
    return this.http.get(`${environment.appUrl}/api/item/getItem`);
  }
  downloadFile(fileName: string): Observable<Blob> {
    const header = new HttpHeaders().set('Content-type', 'application/json');
    return this.http.get(`${environment.appUrl}/api/file/get/` + fileName, { headers: header,responseType: 'blob' });
  }
  addItem(item: NewItem): Observable<any> {
    const header = new HttpHeaders().set('Content-type', 'application/json');
    return this.http.post<NewItem>(`${environment.appUrl}/api/item/addItem`, item, { headers: header,withCredentials:true });
  }
  deleteItem(name: string) {
    const header = new HttpHeaders().set('Content-type', 'application/json');
    return this.http.delete(`${environment.appUrl}/api/item/deleteItem/${name}`, { headers: header, withCredentials: true });
  }

  public mapItemsToDTO(items: any[]): Item[] {
    return items.map(item => ({
      name: item.name,
      price: item.price,
    }));
  }
}
