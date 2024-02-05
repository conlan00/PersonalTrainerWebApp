import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, NgZone, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { CredentialResponse } from 'google-one-tap';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-google',
  templateUrl: './login-google.component.html',
  styleUrl: './login-google.component.css'
})
export class LoginGoogleComponent implements OnInit {
  //  router: any;
  constructor(private socialAuthService: SocialAuthService, private accountService: AccountService,
    private _ngZone: NgZone, private cookieService: CookieService ,private router: Router) {
  }
    ngOnInit(): void {
      // @ts-ignore
      window.onGoogleLibraryLoad = () => {
        // @ts-ignore
        google.accounts.id.initialize({
          client_id: 'Your Google client ID',//klucz który dostajesz od google(taki google token)
          callback: this.handleCredentialResponse.bind(this),//za kazdym razem kiedy google odda ci token lecisz do handlera
          auto_select: false,//czy automatycznie ma wybierac konto ktorym
          //pierwszy raz logowales sie do google   
          cancel_on_tap_outside: true//jesli kliniesz po za okienkiem to sie zamknie
        });
        // @ts-ignore
        google.accounts.id.renderButton(
          // @ts-ignore
          document.getElementById("buttonDiv"),
          { theme: "outline", size: 'large', width: "100%" }
        );
        // @ts-ignore
        google.accounts.id.prompt((notification: PromptMomentNotification) => { });
      };
  }

  async handleCredentialResponse(response: CredentialResponse) {
    //this.cookieService.set('GoogleToken', response.credential)

   // debugger;
    await this.accountService.LoginWithGoogle(response.credential).subscribe(
      (x: any) => {
        //this.cookieService.set('GoogleToken',x.token)
        //localStorage.setItem("token", x.token);
        //debugger;
        this._ngZone.run(() => {
          this.accountService.loggedIn = true;
          this.router.navigateByUrl('/');
        })
      },
      (error: any) => {
        ///debugger
        console.log(error);
      }
    );

  }
}
