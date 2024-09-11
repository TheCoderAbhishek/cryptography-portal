import { Routes } from '@angular/router';
import { LoginComponent } from './features/account/components/login/login.component';
import { DashboardComponent } from './features/dashboard/components/dashboard/dashboard.component';
import { MainLayoutComponent } from './features/main-layout/components/main-layout/main-layout.component';
import { RegisterComponent } from './features/account/components/register/register.component';
import { OtpGenerateComponent } from './features/account/components/otp-generate/otp-generate.component';
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'account-activation', component: OtpGenerateComponent },
  {
    path: 'dashboard',
    component: MainLayoutComponent,
    children: [{ path: '', component: DashboardComponent }],
  },
];
