import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NewItem } from '../models/BusinessModels/NewItem';
import { EmptyUser } from '../models/BusinessModels/EmptyUser';
import { Exercise } from '../models/BusinessModels/Exercise';
import { Training } from '../models/BusinessModels/Training';
import { ExerciseDto } from '../models/BusinessModels/ExerciseDto';

@Injectable({
  providedIn: 'root'
})
export class AdminPanelService {

  constructor(private http: HttpClient) { }


  getDataForChart(): Observable<any> {
    const header = new HttpHeaders().set('Content-type', 'application/json');
    return this.http.get(`${environment.appUrl}/api/transaction/piechart`, { headers: header, withCredentials: true });
  }
  getRevenue(): Observable<any> {
    const header = new HttpHeaders().set('Content-type', 'application/json');
    return this.http.get(`${environment.appUrl}/api/transaction/revenue`, { headers: header, withCredentials: true });
  }
  getTotalRevenue(): Observable<any> {
    const header = new HttpHeaders().set('Content-type', 'application/json');
    return this.http.get(`${environment.appUrl}/api/transaction/totalRevenue`, { headers: header, withCredentials: true });
  }
  getTotalUsers(): Observable<any> {
    const header = new HttpHeaders().set('Content-type', 'application/json');
    return this.http.get(`${environment.appUrl}/api/user/numberUsers`, { headers: header, withCredentials: true });
  }
  postFile(file: any, fileName: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('thumbnail', file, fileName); 

    return this.http.post(`${environment.appUrl}/api/file/uploadFile`, formData, { withCredentials: true });
  }
  addExercise(exercise: string): Observable<any> {
    console.log("poscik", exercise);
    const header = new HttpHeaders().set('Content-type', 'application/json');
    const model: ExerciseDto = {
      exercise: exercise 
    };    return this.http.post<ExerciseDto>(`${environment.appUrl}/api/Exercise/addExercise`, model ,{ headers: header, withCredentials: true });
  }
  getExercises(): Observable<any> {
    const header = new HttpHeaders().set('Content-type', 'application/json');
    return this.http.get(`${environment.appUrl}/api/Exercise/getExercises`, { headers: header, withCredentials: true });
  }
  deleteExercise(name: string) {
  /*  console.log("dilejcik", name);*/

    const header = new HttpHeaders().set('Content-type', 'application/json');

    return this.http.delete(`${environment.appUrl}/api/Exercise/deleteExercise/${name}`, { headers: header, withCredentials: true });
  }
  getEmptyUsers(): Observable<any> {
    const header = new HttpHeaders().set('Content-type', 'application/json');
    return this.http.get(`${environment.appUrl}/api/training/getUsersWithoutTraining`, { headers: header, withCredentials: true });
  }
  addTraining(trainings: Training[]) {
    const header = new HttpHeaders().set('Content-type', 'application/json');
    return this.http.post<Training>(`${environment.appUrl}/api/Training/createTraining`, trainings, { headers: header, withCredentials: true });
  }

  public mapEmptyUsersToDTO(users: any[]): EmptyUser[] {
    return users.map(user => ({
      Email: user.email,
      ItemName:user.itemName,
      Days: user.days,
      IdTransaction:user.idTransaction
    }));
  }
  public mapExerciseToDTO(exercises: any[]): Exercise[] {
    return exercises.map(exer => ({
      IdExercise: exer.idExercise,
      Name:exer.name
    }));
  }
}
