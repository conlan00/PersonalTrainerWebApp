import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';
import { AdminPanelService } from '../admin-panel.service';
import { Observable } from 'rxjs';
import { ItemsService } from '../../items/items.service';
import { NewItem } from '../../models/BusinessModels/NewItem';
import { Item } from '../../models/item';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { TestComponent } from '../../test/test.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../account/account.service';
interface Food {
  value: string;
  viewValue: string;
}
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-create-training',
  templateUrl: './create-training.component.html',
  styleUrl: './create-training.component.scss',
})

export class CreateTrainingComponent implements OnInit {
  items: Item[] = [];




  imageSrc: string = '';
  title = new FormControl('', [Validators.required]);
  price = new FormControl('', [Validators.required]);
  days = new FormControl('', [Validators.required,Validators.pattern(/^\d+(\.\d{1,2})?$/)]);
  selectedFile!: File;
  matcher = new MyErrorStateMatcher();
  fileName = '';
  showSuccessAlert = false;
  showErrorAlert = false;
  selectedItem: any;
  constructor(private http: HttpClient, private adminService: AdminPanelService,
    private itemService: ItemsService, private spinner: TestComponent,
  private router: Router, private route: ActivatedRoute,private accountService:AccountService ) { }


  refreshFlag = false;
  refreshComponent() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['./'], {
      relativeTo: this.route
    })
  }
  getItems() {
    this.itemService.getItems().subscribe((response) => {
      this.items = this.itemService.mapItemsToDTO(response);
      console.log('Itemsy:', this.items);
    });
  }


  ngOnInit(): void {
    this.getItems();
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
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    const fileInput = event.target;
    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageSrc = e.target.result;
      };
      reader.readAsDataURL(fileInput.files[0]);
    }
  }
  uploadFile(): void {
    console.log('Ładowanie.............');
    if (this.title.valid && this.price.valid && this.days.valid && this.selectedFile) {

      const fileName: string = this.title.value ?? 'defaultFileName';

      this.adminService.postFile(this.selectedFile, fileName + '.jpg').subscribe({
        next: (response: any) => {
          console.log('File uploaded successfully:', response);

          // Aktualizuj zmienne dla alertów w przypadku sukcesu
          this.showSuccessAlert = true;
          this.showErrorAlert = false;

          // Czekaj 3 sekundy i ukryj alert sukcesu
          setTimeout(() => {
            this.showSuccessAlert = false;
          }, 3000);
        },
        error: (error: any) => {
          console.error('Error uploading file:', error);

          // Aktualizuj zmienne dla alertów w przypadku błędu
          this.showSuccessAlert = false;
          this.showErrorAlert = true;

          // Czekaj 3 sekundy i ukryj alert błędu
          setTimeout(() => {
            this.showErrorAlert = false;
          }, 3000);

          // Dodać tę linijkę, aby zobaczyć szczegóły błędu w konsoli
          console.log('Detected error:', error);
        }
      });
      this.addItem();
    /*(error) => {
      console.error('Error uploading file:', error);

      // Aktualizuj zmienne dla alertów w przypadku błędu
      this.showSuccessAlert = false;
      this.showErrorAlert = true;

      // Czekaj 3 sekundy i ukryj alert błędu
      setTimeout(() => {
        this.showErrorAlert = false;
      }, 3000);
    }*/

      //this.addItem();
    }/* else {
      console.error('Please fill in all required fields before uploading the file.');

      // Aktualizuj zmienne dla alertów w przypadku błędu
      this.showSuccessAlert = false;
      this.showErrorAlert = true;

      // Czekaj 3 sekundy i ukryj alert błędu
      setTimeout(() => {
        this.showErrorAlert = false;
      }, 3000);
      //this.addItem();
    }*/
  }
  addItem() {
    this.spinner.startspinner();
    const newItem: NewItem = {
      IdItem: 0,
      name: this.title.value as string ,
      price: this.price.value !== null ? +this.price.value : 0,
      Days: this.days.value !== null ? +this.days.value : 0,
    };

    this.itemService.addItem(newItem).subscribe(
      (response) => {
        console.log('Dane wysłane pomyślnie:', response);
        // Obsłuż sukces, jeśli to konieczne
       
        this.getItems();
        this.refreshComponent();
      },
      (error) => {
        console.error('Błąd podczas wysyłania danych:', error);
        // Obsłuż błąd, jeśli to konieczne
      }
    );
  }
  deleteItem() {
    this.spinner.startspinner();
    
    this.itemService.deleteItem(this.selectedItem.name).subscribe(
      (response) => {
      console.log('Dane wysłane pomyślnie:', response);
        // Obsłuż sukces, jeśli to konieczne
        this.getItems();
    },
      (error) => {
        console.error('Błąd podczas wysyłania danych:', error);
        // Obsłuż błąd, jeśli to konieczne
      }
    )
   //
    
  }
}
