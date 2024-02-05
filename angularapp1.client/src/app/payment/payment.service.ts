import { Injectable } from '@angular/core';
import { NewTransaction } from '../models/BusinessModels/NewTransaction';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  item:  string | null | undefined;
  price: string | null | undefined;
  url: string | null | undefined;

  IdTransaction: string | null | undefined;
  info = "";
  constructor(private http: HttpClient) { }


  
  createTransaction(model: NewTransaction) {
    const header = new HttpHeaders().set('Content-type', 'application/json');
    return this.http.post<NewTransaction>(`${environment.appUrl}/api/transaction/newTransaction`, model, { headers: header, withCredentials: true });
  }


}
