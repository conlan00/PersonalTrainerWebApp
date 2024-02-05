import { Component, Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrl: './test.component.css'
})
  @Injectable({
    providedIn: 'root',
  })
export class TestComponent {
  constructor(private spinner: NgxSpinnerService) { }
  public startspinner() {
    this.spinner.show();

    setTimeout(() => {

      this.spinner.hide();
    }, 2000);
  }

  public start() {
    this.spinner.show();
  }
  public stop() {
    this.spinner.hide();
  }

  }
