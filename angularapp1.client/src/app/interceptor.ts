import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, catchError, of, throwError } from "rxjs";
import { AccountService } from "./account/account.service";
import { LoadingController } from "@ionic/angular";
import { NgxSpinnerService } from "ngx-spinner";


@Injectable()
export class Interceptor implements HttpInterceptor {
  constructor(private inject: Injector, private router: Router, private spinner: NgxSpinnerService,private accountService:AccountService) { }
  ctr = 0;
  private loading: any;
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError(x => this.handleAuthError(x)));
  }


  openSpinner() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 2500)
  }
  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    console.log("dlaczego przechwytuje",err)
    if (err && err.status === 401 && this.ctr != 1) {
      this.ctr++

      let service = this.inject.get(AccountService);
      service.refreshTokenInterceptor().subscribe({
        next: (x: any) => {
          //tu zrobić loading screen

          return of("twoj token zostal odswiezony");
        },
        error: (err: any) => {
          service.revokeToken().subscribe({
            next: (x: any) => {
              this.router.navigateByUrl('/account/login');
              return of(err.message);
            }
          })
        }
      });
      return of("proba odswiezenia tokena")

    }
    else {
      this.ctr = 0;
      
      return throwError(() => new Error("Brak autentykacji blad"));
     
    }


  }
}

//gdy bedzie juz admin to wrocic do tego
/*
  constructor(private inject: Injector, private router: Router, private spinner:NgxSpinnerService) { }
  ctr = 0;
  private loading: any;
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError(x => this.handleAuthError(x)));
  }


  openSpinner() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    },2500)
  }
            private handleAuthError(err: HttpErrorResponse): Observable < any > {
  if(err && err.status === 401 && this.ctr != 1) {
  this.ctr++

  let service = this.inject.get(AccountService);
  service.refreshTokenInterceptor().subscribe({
    next: (x: any) => {
      //tu zrobić loading screen

      return of("twoj token zostal odswiezony");
    },
    error: (err: any) => {
      service.revokeToken().subscribe({
        next: (x: any) => {
          this.router.navigateByUrl('/account/login');
          return of(err.message);
        }
      })
    }
  });
  return of("proba odswiezenia tokena")

}
    else {
  this.ctr = 0;
  return throwError(() => new Error("Brak autentykacji blad"));
}
  }*/
