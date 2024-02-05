import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  registerForm: FormGroup = new FormGroup({});
  submitted = false;
  errorMessages: string[] = [];
  constructor(private accountService: AccountService, private appService: AccountService,
    private formBuilder: FormBuilder,private router:Router) {

  }
  ngOnInit(): void {
    this.initializeForm();

  }
  initializeForm() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.pattern('^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]],
    })
  }
  register() {
    this.submitted = true;
    this.errorMessages = [];
    if (this.registerForm.valid) {
      this.accountService.register(this.registerForm.value).subscribe({
        next: (response: any) => {
          console.log("chuyj")
          this.accountService.showNotification(true, response.value.title, response.value.message);
          this.router.navigateByUrl('/account/login')
        },
        error: error => {
          console.log(error.error)
          if (error.errors) {
            console.log("chuyj000")

            this.errorMessages = error.errors;
          } else {
            console.log("chuyj1111")
            this.errorMessages.push(error.error)

            this.errorMessages.push("Konto o takim mailu juz istnieie")
          }
        }
      })
   }

  }
}
