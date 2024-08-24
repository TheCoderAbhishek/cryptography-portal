import { Routes } from '@angular/router';
import { LoginComponent } from './features/account/components/login/login.component';
// import { DashboardComponent } from './features/dashboard/components/';   

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent }
];