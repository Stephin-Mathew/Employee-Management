import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageHeaderComponent } from '../ui components/page-header/page-header.component';
import { SidebarComponent } from '../ui components/sidebar/sidebar.component';
import { EmployeeListComponent } from '../employee-list/employee-list.component';

@Component({
  selector: 'app-employee-list-page',
  standalone: true,
  imports: [PageHeaderComponent,SidebarComponent, EmployeeListComponent, RouterOutlet],
  templateUrl: './employee-list-page.component.html',
  styleUrl: './employee-list-page.component.css',
})
export class EmployeeListPageComponent {}