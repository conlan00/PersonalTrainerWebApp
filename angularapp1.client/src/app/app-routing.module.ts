import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { HomeComponent } from "./home/home.component";
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ValidationMessagesComponent } from "./errors/validation-messages/validation-messages.component";
import { AboutComponent } from "./about/about.component";
import { RegisterComponent } from "./account/register/register.component";
import { ConfirmEmailComponent } from './account/confirm-email/confirm-email.component';
import { ItemsComponent } from './items/items.component';
import { PaymentComponent } from './payment/payment.component';
import { PaypalButtonComponent } from './paypal-button/paypal-button.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { CreateTrainingComponent } from './admin-panel/create-training/create-training.component';
import { DashboardComponent } from './admin-panel/dashboard/dashboard.component';
import { TestComponent } from './test/test.component';
import { CreateTariningUserComponent } from './admin-panel/create-tarining-user/create-tarining-user.component';
import { AddExerciseComponent } from './admin-panel/add-exercise/add-exercise.component';
import { AuthGuardService } from './auth-guard.service';
import { DietaComponent } from './user/dieta/dieta/dieta.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'user', component: UserComponent, canActivate: [AuthGuardService], data: { roles: ['User'] } },
  { path: 'user/diet', component: DietaComponent,canActivate: [AuthGuardService], data: { roles: ['User'] } },
  { path: 'shopping-cart', component: ShoppingCartComponent },
  { path: 'items', component: ItemsComponent },
  { path: 'payment', component: PaymentComponent,canActivate: [AuthGuardService], data: { roles: ['User'] } },
  { path: 'paypal', component: PaypalButtonComponent, canActivate: [AuthGuardService], data: { roles: ['User'] } },
  { path: 'admin', component: AdminPanelComponent, canActivate: [AuthGuardService], data: { roles: ['Admin'] } },
  { path: 'admin/createtraining', component: CreateTrainingComponent, canActivate: [AuthGuardService], data: { roles: ['Admin'] } },
  { path: 'admin/dashboard', component: DashboardComponent, canActivate: [AuthGuardService], data: { roles: ['Admin'] } },
  { path: 'admin/exercise', component: AddExerciseComponent, canActivate: [AuthGuardService], data: { roles: ['Admin'] } },
  { path: 'admin/plan', component: CreateTariningUserComponent, canActivate: [AuthGuardService], data: { roles: ['Admin'] } },
  
  { path: 'test', component: TestComponent },
  { path: 'account', loadChildren: () => import('./account/account.module').then(module => module.AccountModule) },
  { path: 'not-found', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent, pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
//export const routingComponents = [ShoppingCartComponent, UserComponent, HomeComponent, NotFoundComponent, ValidationMessagesComponent,AboutComponent]

