import {  Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AdminPanelService } from '../admin-panel.service';
import { TestComponent } from '../../test/test.component';
import { map } from 'rxjs';
import { AccountService } from '../../account/account.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-add-exercise',
  templateUrl: './add-exercise.component.html',
  styleUrl: './add-exercise.component.css'
})

export class AddExerciseComponent implements OnInit {
  constructor(private adminService: AdminPanelService, private spinner: TestComponent,private accountService:AccountService) { }
    ngOnInit(): void {
      this.getExercises();
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
    }
  title = new FormControl('', [Validators.required]);
  matcher = new MyErrorStateMatcher();
  fileName = '';
  showSuccessAlert = false;
  showErrorAlert = false;
  value = 'Kcal';
  selectedItem: any;
  exercises: string[] = [];
  addExercise() {
    this.spinner.startspinner();
    console.log(this.title.value);
    this.adminService.addExercise(this.title.value ?? '').subscribe({
      next: (response: any) => {
        console.log("Dodano do bazy");
        this.getExercises();
      },
      error: (error: any) => {
        console.log("Nie dodano do bazy");
      }
    })
  }

  getExercises() {
    this.adminService.getExercises().subscribe({
      next: (data: any) => {
        console.log(data);
        this.exercises = data.map((exe: { name: any; }) => exe.name);
        console.log('Odebrano dane:', this.exercises);
      },
      error: (error: any) => {
        console.error('Błąd podczas pobierania danych:', error);
      }
    });
  }
  deleteExercise() {
    this.spinner.startspinner();
    console.log(this.selectedItem);
    this.adminService.deleteExercise(this.selectedItem).subscribe(
      (response) => {
        console.log('Dane wysłane pomyślnie:', response);
        // Obsłuż sukces, jeśli to konieczne
        this.getExercises();
      },
      (error) => {
        console.error('Błąd podczas wysyłania danych:', error);
        // Obsłuż błąd, jeśli to konieczne
      }
    )
  }
  }

