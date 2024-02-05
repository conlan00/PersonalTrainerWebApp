import { Component, OnInit } from '@angular/core';
import { MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormsModule } from '@angular/forms';
import { EmptyUser } from '../../models/BusinessModels/EmptyUser';
import { AdminPanelService } from '../admin-panel.service';
import { Exercise } from '../../models/BusinessModels/Exercise';
import { Training } from '../../models/BusinessModels/Training';
import { BusinessTraining } from '../../models/BusinessModels/BusinessTraining';
import { AccountService } from '../../account/account.service';

@Component({
  selector: 'app-create-tarining-user',
  templateUrl: './create-tarining-user.component.html',
  styleUrl: './create-tarining-user.component.scss'
})
export class CreateTariningUserComponent implements OnInit {
  constructor(private adminService: AdminPanelService, private accountService:AccountService) { }
    ngOnInit(): void {
      this.getEmptyUsers();
      this.getExercises();
      /*console.log("na inicei",this.lotsOfTabs)*/
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


  toppings = new FormControl('');
/*  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
*/
  plan: any;
  displayedColumns1: string[] = ['lp','exerciseName'];
  traningOnDay: Training[] = [];
/*  displayedColumns = ['position', 'name', 'weight'];
  displayedColumns1 = ['position', 'name'];*/
  exercises: Exercise []= [];
  emptyUsers: EmptyUser[] = [];
  lotsOfTabs: string[] = [];
  lotsOfTabs1: number[] = [];
  getEmptyUsers() {
    this.adminService.getEmptyUsers().subscribe(
      (response) => {
        console.log(response);
        this.emptyUsers = this.adminService.mapEmptyUsersToDTO(response);
        console.log('Empty users:', this.emptyUsers);
      },
      (error) => {
        console.error(`nie pobralo`);
      }
    )
  }

  selectedValue: string | undefined;
  selectedId: any;
  selectedDay: any;
  selectedExercises: Exercise[] = [];
  selectedExercisesCopy: Exercise[] = [];



  onChange1() {
    const selectedUserObj = this.emptyUsers.find(user => user.IdTransaction === this.selectedId.IdTransaction);
    if (selectedUserObj) {
      this.fillArray(parseInt(selectedUserObj.Days));
      this.plan = selectedUserObj.ItemName;
    }
  }
  fillArray(x: number) {
    this.lotsOfTabs1 = Array.from({ length: x }, (_, index) => (index + 1));
    this.lotsOfTabs = Array.from({ length: x }, (_, index) => (index + 1).toString());
  }
  getExercises() {
    this.adminService.getExercises().subscribe({
      next: (data: any) => {
        //console.log(data);
        this.exercises = this.adminService.mapExerciseToDTO(data);
        console.log('Odebrano dane:', this.exercises);
      },
      error: (error: any) => {
        console.error('Błąd podczas pobierania danych:', error);
      }
    });
  }
  addToArray() {
    const tab: string[] = [];
    for (let i = 0; i < this.selectedExercises.length; i++) {
      console.log(this.selectedExercises[i])
      const obj = this.exercises.find(ex => ex.Name === this.selectedExercises[i].Name);
      if (obj) {
        tab.push(obj.IdExercise);
      }
    }
    for (let i = 0; i < this.selectedExercises.length; i++) {
      console.log(this.selectedDay)

      const trainObj: Training ={
       DayOfWeek : this.selectedDay,
        IdTransaction: this.selectedId.IdTransaction,
       IdExercise : tab[i],
      }
      this.traningOnDay.push(trainObj);
    }
    this.selectedExercises = [];
    console.log("rekord trningu",this.traningOnDay);
  }
  getExercisesForDay(day: number): BusinessTraining[] {
    const zmienna = this.mapTrainingToDTO(this.traningOnDay)
    return zmienna.filter(training => +training.dayOfWeek === day);
  }
  private mapTrainingToDTO(training: any[]): BusinessTraining[] {
    for (let i = 0; i < this.selectedExercises.length; i++) {
      this.selectedExercisesCopy.push(this.selectedExercises[i])
    }
    
    return training.map(trainingItem => {
      const selectedExercise = this.selectedExercisesCopy.find(ex => ex.IdExercise === trainingItem.IdExercise);

      return {
        exerciseName: selectedExercise?.Name ?? '',
        dayOfWeek: trainingItem.DayOfWeek,
      } as BusinessTraining;
    });
  }
  deleteButton(actualElement: string,index:number){
    console.log(actualElement ,index);
    const deleteObj = this.exercises.find(ex => ex.Name === actualElement);
    for (let i = 0; i < this.traningOnDay.length; i++) {
      const trainObj = this.traningOnDay.find(tr => tr.IdExercise === deleteObj?.IdExercise && tr.DayOfWeek===index.toString())
      this.traningOnDay = this.usunObiektZTablicy(this.traningOnDay, trainObj);
    }
    console.log("DO WYSLANIA ::", this.traningOnDay);
  }
   usunObiektZTablicy(tablica: any[], obiektDoUsuniecia: any): any[] {
      return tablica.filter(obj => obj !== obiektDoUsuniecia);
    }
  saveTraining() {
    this.adminService.addTraining(this.traningOnDay).subscribe({
      next: (response: any) => {
        console.log("Dodano do bazy");
        this.getEmptyUsers();
      },
        error: (error: any) => {
          console.log("Nie dodano do bazy");
        }
    })
  }

}

