import { Routes } from '@angular/router';
import { EmployeeAnalysisComponent } from './components/employee-analysis/employee-analysis.component';
import { LoginComponent } from './components/login/login.component';
import { EmployeeManagementComponent } from './components/employee-management/employee-management.component';
import { EmployeeDetailsComponent } from './components/employee-details/employee-details.component';
import { EmployeeListPageComponent } from './components/employee-list-page/employee-list-page.component';
import { SignupComponent } from './components/signup/signup.component';
import { HelpComponent } from './components/help/help.component';
import { AboutComponent } from './components/about/about.component';
import { AccessManagementComponent } from './components/access-management/access-management.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'analysis',
    component: EmployeeAnalysisComponent,
    canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    redirectTo: 'analysis',
    pathMatch: 'full',
  },
  {
    path: 'Dashboard',
    redirectTo: 'analysis',
    pathMatch: 'full',
  },
  {
    path: 'employees/table',
    component: EmployeeManagementComponent,
    canActivate: [authGuard],
  },
  {
    path: 'employees/list',
    component: EmployeeListPageComponent,
    canActivate: [authGuard],
    children: [
   { path: '', component: EmployeeDetailsComponent },
   { path: ':employeeId', component: EmployeeDetailsComponent },
  ],
  },
  {
    path: 'help',
    component: HelpComponent,
    canActivate: [authGuard],
  },
  {
    path: 'about',
    component: AboutComponent,
    canActivate: [authGuard],
  },
  {
    path: 'access-management',
    component: AccessManagementComponent,
    canActivate: [authGuard, adminGuard],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];