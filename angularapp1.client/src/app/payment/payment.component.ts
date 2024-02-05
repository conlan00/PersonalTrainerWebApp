import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { render } from 'creditcardpayments/creditCardPayments'
import { PaypalButtonComponent } from '../paypal-button/paypal-button.component';
import { PaymentService } from './payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
})
export class PaymentComponent implements OnInit {
   item: string | null | undefined;
  price: string | null | undefined;
  url: string | null | undefined;
  constructor(public paymentService:PaymentService ) { }


  ngOnInit(): void {
    this.item = localStorage.getItem("Item");
    this.price = localStorage.getItem("Price");
    this.url = localStorage.getItem("Url");
    this.paymentService.item = this.item;
    this.paymentService.price = this.price;
    this.paymentService.url = this.url;
    ///console.log(this.item + " == " + this.price);
  }






}
