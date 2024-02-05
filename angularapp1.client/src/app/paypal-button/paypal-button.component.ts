import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { PaymentService } from '../payment/payment.service';

declare var paypal: any;

@Component({
  selector: 'app-paypal-button',
  templateUrl: './paypal-button.component.html',
  styleUrls: ['./paypal-button.component.css'],
})
export class PaypalButtonComponent implements AfterViewInit {
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef | undefined;
  constructor(private paymentService: PaymentService) {
  }
  product = {
    price: this.paymentService.price,
  };
  paidFor = false;
  ngAfterViewInit(): void {
    this.initPayPal();
  }

  private initPayPal(): void {
    if (typeof paypal === 'undefined') {
      console.error('Błąd: Obiekt PayPal nie jest zdefiniowany');
      return;
    }

    paypal
      .Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  currency_code: 'USD',
                  value: this.product.price,
                },
              },
            ],
          });
        },
        onApprove:  (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            console.log(details.status);
            if (details.status === 'COMPLETED') {
              this.paymentService.IdTransaction = details.id
              this.paidFor = true;
              if ((this.paymentService.item !== undefined) && (this.paymentService.item !==null)) {
                this.paymentService.createTransaction({
                    itemName: this.paymentService.item,
                  isPaid: this.paidFor,
                  dateOfTransacton: details.update_time
                }).subscribe({
                  next: (response: any) => {
                    this.paymentService.info = "TRANSAKCJA ZREALIZOWANA";
                  }
                })
              }
             
              console.log(details);
            }
            
          });
        },
        onError: (err: any) => {
          console.log(err);
        }
      })
      .render(this.paypalElement?.nativeElement);
  }
}
