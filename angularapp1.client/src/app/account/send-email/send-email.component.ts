import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.css']
})
export class SendEmailComponent implements OnInit {
  emailForm: FormGroup = new FormGroup({});
  submitted = false;
  mode: string | undefined;
  errorMessages: string[] = [];

  constructor(
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    // Przeniesione wywołanie initializeForm do konstruktora
    this.initializeForm();
  }

  ngOnInit(): void {
    this.accountService.checkLoginStatus().subscribe(
      (isLoggedIn: boolean) => {
        if (isLoggedIn) {
          this.router.navigateByUrl('/');
        } else {
          const mode = this.activatedRoute.snapshot.paramMap.get('mode');
          if (mode) {
            this.mode = mode;
            console.log(this.mode);
          }
        }
      },
      (error) => {
        console.error('Błąd podczas sprawdzania statusu logowania:', error);
        // Dodaj obsługę błędu, jeśli to konieczne
      }
    );
  }

  initializeForm() {
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$')]],
    });
  }

  sendEmail() {
    this.submitted = true;
    this.errorMessages = [];

    if (this.emailForm.valid && this.mode) {
      if (this.mode.includes('resend-confirmation-link')) {
        console.log(this.emailForm.get('email')?.value);

        this.accountService.resendEmailConfirmationLink(this.emailForm.get('email')?.value).subscribe({
          next: (response: any) => {
            this.router.navigateByUrl('/account/login');
          },
          error: (error) => {
            //  console.log(error.error);
            if (error.error && error.error.errors) {
              // console.log(error.error.errors);
              this.errorMessages = error.error.errors;
            } else {
              // console.log(error.error);
              this.errorMessages.push('Twoj adres email zostal juz potwierdzony. Zaloguj sie na swoje konto');
            }
          },
        });
      } else if (this.mode.includes('forgot-username-or-password')) {
        this.accountService.forgotUsernameOrPassword(this.emailForm.get('email')?.value).subscribe({
          next: (response: any) => {
            this.router.navigateByUrl('/account/login');
          },
          error: (error) => {
            //  console.log(error.error);
            if (error.error && error.error.errors) {
              // console.log(error.error.errors);
              this.errorMessages = error.error.errors;
            } else {
              // console.log(error.error);
              this.errorMessages.push("Email musi byc potwerdzony");
            }
          }
        })
      }
    }
  }

  cancel() {
    this.router.navigateByUrl('/account/login');
  }
}
