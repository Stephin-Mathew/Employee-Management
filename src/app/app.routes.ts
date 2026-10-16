import { Routes } from '@angular/router';
import { EmployeeAnalysisComponent } from './components/employee-analysis/employee-analysis.component';
import { LoginComponent } from './components/login/login.component';
import { EmployeeTablePageComponent } from './components/employee-table/employee-table-page.component';
import { EmployeeDetailsComponent } from './components/employee-details/employee-details.component';
import { EmployeeListPageComponent } from './components/employee-list-page/employee-list-page.component';
import { SignupComponent } from './components/signup/signup.component';
import { HelpComponent } from './components/help/help.component';
import { AboutComponent } from './components/about/about.component';
import { AccessManagementComponent } from './components/access-management/access-management.component';
import { EmployeeLayoutComponent } from './components/employee-layout/employee-layout.component';
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
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: EmployeeLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'analysis',
        component: EmployeeAnalysisComponent,
      },
      {
        path: 'employees/table',
        component: EmployeeTablePageComponent,
      },
      {
        path: 'employees/list',
        component: EmployeeListPageComponent,
        children: [
          { path: '', component: EmployeeDetailsComponent },
          { path: ':employeeId', component: EmployeeDetailsComponent },
        ],
      },
      {
        path: 'help',
        component: HelpComponent,
      },
      {
        path: 'about',
        component: AboutComponent,
      },
      {
        path: 'access-management',
        component: AccessManagementComponent,
        canActivate: [adminGuard],
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];