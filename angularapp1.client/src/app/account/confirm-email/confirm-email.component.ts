import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { __param } from 'tslib';
import { ConfirmEmail } from '../../models/ConfirmEmail';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.css'
})
export class ConfirmEmailComponent implements OnInit {
  success = true;
  constructor(private accountService: AccountService, private router: Router,
    private activeRoute: ActivatedRoute) { }
  ngOnInit(): void {
    this.accountService.checkLoginStatus().subscribe(
      (isLoggedIn: boolean) => {
        if (isLoggedIn) {
          this.router.navigateByUrl('/');
        } else {
          this.activeRoute.queryParamMap.subscribe((params: any) => {
            const confirmEmail: ConfirmEmail = {
              token: params.get('token'),
              email: params.get('email'),
            }
            this.accountService.confirmEmail(confirmEmail).subscribe({
              next: (response: any) => {
                
              }, error: error => {
                this.success = false;
              }
            })
          });
        }
      },
      (error) => {
        console.error('Błąd podczas sprawdzania statusu logowania:', error);
        // Dodaj obsługę błędu, jeśli to konieczne
      }
    );
  }
  resendEmailConfirmationLink() {
    this.router.navigateByUrl('/account/send-email/resend-confirmation-link');
  }
  
}
