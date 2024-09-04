import { Routes } from '@angular/router';
import { LoginComponent } from './features/account/components/login/login.component';
import { DashboardComponent } from './features/dashboard/components/dashboard/dashboard.component';
import { MainLayoutComponent } from './features/main-layout/components/main-layout/main-layout.component';
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: MainLayoutComponent,   
 // Use the layout component
    children: [
      { path: '', component: DashboardComponent } 
    ]
  },
];
