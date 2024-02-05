import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { NavBarComponent } from './nav-bar/nav-bar.component'
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { FormControl, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { NotificationComponent } from './modals/notification/notification.component';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { GoogleLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { environment } from '../environments/environment.development';
import { Interceptor } from './interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ItemsComponent } from './items/items.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { PaymentComponent } from './payment/payment.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { MatStepperModule } from '@angular/material/stepper';
import { PaypalButtonComponent } from './paypal-button/paypal-button.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { ButtonModule } from 'primeng/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FileUploadModule } from 'primeng/fileupload';
import { SplitterModule } from 'primeng/splitter';
import { ToolbarModule } from 'primeng/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { CreateTrainingComponent } from './admin-panel/create-training/create-training.component';
import { DashboardComponent } from './admin-panel/dashboard/dashboard.component';
import { NgChartsModule } from 'ng2-charts';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AlertModule } from 'ngx-bootstrap/alert';
import { MatSelectModule } from '@angular/material/select';
import { TestComponent } from './test/test.component';
import { CreateTariningUserComponent } from './admin-panel/create-tarining-user/create-tarining-user.component';
import { MatButtonToggleGroup, MatButtonToggleModule } from '@angular/material/button-toggle';
import { AddExerciseComponent } from './admin-panel/add-exercise/add-exercise.component';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { DietaComponent } from './user/dieta/dieta/dieta.component';
import { MatChipsModule } from '@angular/material/chips';
const CLIENT_ID = `${environment.ClientGoogleID}`;
@NgModule({
  declarations: [
    HomeComponent,
    AppComponent,
    NavBarComponent,
    ItemsComponent,
    AboutComponent,
    ShoppingCartComponent,
    NotificationComponent,
    PaypalButtonComponent,
    PaymentComponent,
    AdminPanelComponent,
    CreateTrainingComponent,
    DashboardComponent,
    TestComponent,
    CreateTariningUserComponent,
    AddExerciseComponent,
    UserComponent,
    DietaComponent
    
    // routingComponents,
  ],
  imports: [
    BrowserModule, HttpClientModule,
    AppRoutingModule,
    ///AdminAppRoutingModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    RouterModule,
    ReactiveFormsModule,
    MatTableModule,
    ModalModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatCardModule,
    MatTabsModule,
    MatBadgeModule,
    NgxPayPalModule,
    MatStepperModule,
    MatButtonModule,
    MatCardModule,
    ButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    FileUploadModule,
    SplitterModule,
    ToolbarModule,
    MatSidenavModule,
    MatListModule,
    NgChartsModule,
    AnimateOnScrollModule,
    CarouselModule.forRoot(),
    TooltipModule.forRoot(),
    AlertModule.forRoot(),
    MatSelectModule,
    MatButtonToggleModule,
    MatChipsModule
  ],
  exports: [
    ReactiveFormsModule,

  ],
  providers: [BsModalService, TestComponent,

    {
      provide: "SocialAuthServiceConfig",
      useValue: {
        autoLogin: true,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              CLIENT_ID
            )
          }
        ]
      } as SocialAuthServiceConfig
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true
    }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AppModule { }
