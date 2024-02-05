import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from '../../../admin-panel/create-training/create-training.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { TestComponent } from '../../../test/test.component';

@Component({
  selector: 'app-dieta',
  templateUrl: './dieta.component.html',
  styleUrl: './dieta.component.css'
})
export class DietaComponent {
  constructor(private http: HttpClient,private spinner: TestComponent) { }
  title = new FormControl('', [Validators.required]);
  adds = new FormControl();
  matcher = new MyErrorStateMatcher();
  value = 'Ex . 2000';
  value1 = 'Ex . ryby';
  empty = '';
  kcal = '';
  meals = "";
  res: any;
  addExercise() {
    if (!this.adds.value) {
      this.empty = ''
    } else {
      this.empty='Bez użycia '+this.adds.value
    }
    this.kcal = this.title.value!;
    this.spinner.start()
    this.sendGetRequest(this.kcal,this.empty)
  }
  sendGetRequest(value1: string, value2: string) {
    const params = new HttpParams()
      .set('kcal', value1)
      .set('adds', value2);
    const url = `${environment.appUrl}/api/OpenAi/getDiets`;
    this.http.get(url, { params }).subscribe((response: any) => {
      this.spinner.stop();
      this.res = response;
      this.meals = response.value
      console.log(response)
    }, error => {
      console.error(error);
    });
  }
}
