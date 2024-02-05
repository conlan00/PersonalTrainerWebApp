import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { User } from '../../models/User';
import google, {CredentialResponse , PromptMomentNotification } from 'google-one-tap'
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  submitted = false;
  errorMessages: string[] = [];

  constructor(private accountService: AccountService,
    private formBuilder: FormBuilder, private router: Router,
    private _ngZone: NgZone, private socialAuthService: SocialAuthService,
    private cookieService: CookieService) {
    this.accountService.user$.pipe(take(1)).subscribe({
      next: (user: User | null) => {
        if (user) {
          this.router.navigateByUrl('/');
        }
      }
    })
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    })
  }
  login() {
    this.submitted = true;
    this.errorMessages = [];
    this.accountService.checkLoginStatus().subscribe({
      next: (response: any) => {
        if (response) {
          this.accountService.loggedIn = true;

        }

      },
      error: (error: any) => {
        if (error.error.errors) {

        } else {

        }
      }
    })
    if (this.loginForm.valid) {
      this.accountService.login(this.loginForm.value).subscribe({
        next: (response: any) =>
        {
          /*this.cookieService.set('Authorization', `Bearer ${response.jwt}`,
            undefined, '/', undefined, true, 'Strict')*/
          //localStorage.setItem("user",response.email);
          this.accountService.loggedIn = true;
          //this.accountService.getRole();
          this.router.navigateByUrl('/');
        },
        error: error => {
          if (error.error.errors) {
            this.errorMessages = error.error.errors;
          } else {
            this.errorMessages.push(error.error)
          }
        }
      })
    }
  }

  /*async handleCredentialResponse(response: CredentialResponse) {
    await this.accountService.LoginWithGoogle(response.credential).subscribe(
      (x:any) => {
        localStorage.setItem("token", x.token);
        this._ngZone.run(() => {
          this.router.navigateByUrl('/');
        })
      },
      (error: any) => {
        ///debugger
        console.log(error);
      }
    );

  }*/

  resendEmailConfirmationLink() {
    this.router.navigateByUrl('/account/send-email/resend-confirmation-link');

  }




}
