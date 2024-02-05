import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPassword } from '../../models/ResetPassword';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup = new FormGroup({});
  token: string | undefined;
  email: string | undefined;
  submitted = false;
  errorMessages: string[] = [];
  constructor(private accountService: AccountService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }
    ngOnInit(): void {
      this.accountService.checkLoginStatus().subscribe(
        (isLoggedIn: boolean) => {
          if (isLoggedIn) {
            this.router.navigateByUrl('/');
          } else {
            this.activatedRoute.queryParamMap.subscribe({
              next: (params: any) => {
                this.token = params.get('token');
                this.email = params.get('email');
                if (this.token && this.email) {
                  console.log(this.email)
                  this.initializeForm(this.email);
                } else {
                  this.router.navigateByUrl('/account/login');
                }
              }
            })
          }
        },
        (error) => {
          console.error('Błąd podczas sprawdzania statusu logowania:', error);
          // Dodaj obsługę błędu, jeśli to konieczne
        }
      );
    }
  initializeForm(username: string) {
    this.resetPasswordForm = this.formBuilder.group({
      email: [{ value: username, disabled: true }],
      newPassword:['',[Validators.required,Validators.minLength(6),Validators.maxLength(15)]]
    });
  }
  resetPassword() {
    this.submitted = true;
    this.errorMessages = [];

    if (this.resetPasswordForm.valid && this.email && this.token) {
      const model: ResetPassword = {
        token: this.token,
        email: this.email,
        newPassword: this.resetPasswordForm.get('newPassword')?.value
      };
      this.accountService.resetPassowrd(model).subscribe({
        next: (response: any) => {
          this.router.navigateByUrl('/account/login')
        }, error: (error) => {
          //  console.log(error.error);
          if (error.error.errors) {
            // console.log(error.error.errors);
            this.errorMessages = error.error.errors;
          } else {
            // console.log(error.error);
            this.errorMessages.push(error.error);
          }
        }
      })
    }
  }
}
