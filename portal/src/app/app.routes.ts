import { Routes } from '@angular/router';
import { LoginComponent } from './features/account/components/login/login.component';
import { DashboardComponent } from './features/dashboard/components/dashboard/dashboard.component';
import { MainLayoutComponent } from './features/main-layout/components/main-layout/main-layout.component';
import { RegisterComponent } from './features/account/components/register/register.component';
import { OtpGenerateComponent } from './features/account/components/otp-generate/otp-generate.component';
import { OtpVerifyComponent } from './features/account/components/otp-verify/otp-verify.component';
import { ActiveUsersComponent } from './features/user_management/components/active-users/active-users.component';
import { CreateUserComponent } from './features/user_management/components/active-users/create-user/create-user.component';
import { InactiveUsersComponent } from './features/user_management/components/inactive-users/inactive-users.component';
import { KeyListComponent } from './features/key-management/components/key-list/key-list.component';
export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'account-activation', component: OtpGenerateComponent },
  { path: 'otp-verify', component: OtpVerifyComponent },
  {
    path: 'dashboard',
    component: MainLayoutComponent,
    children: [{ path: '', component: DashboardComponent }],
  },
  {
    path: 'user-management',
    component: MainLayoutComponent,
    children: [
      { path: 'active-users', component: ActiveUsersComponent },
      { path: 'create-user', component: CreateUserComponent },
      { path: 'inactive-users', component: InactiveUsersComponent },
    ],
  },
  {
    path: 'key-management',
    component: MainLayoutComponent,
    children: [
      { path: 'key-list', component: KeyListComponent },
    ],
  },
];
