import { Component, inject } from '@angular/core';

import { DeleteModalComponent } from '../delete-modal/delete-modal.component';
import { EmployeeModalComponent } from '../ui components/employee-modal/employee-modal.component';
import { TableHeaderComponent } from '../table-header/table-header.component';
import { CustomTableComponent } from '../ui components/custom-table/custom-table.component';
import { TableColumn, TableActionEvent } from '../../interfaces/table.interface';
import { EmployeeInterface } from '../../interfaces/employee.interface';
import { InputValue } from '../../interfaces/input.interface';
import { EmployeeService } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-employee-table-page',
  standalone: true,
  imports: [
    TableHeaderComponent,
    EmployeeModalComponent,
    DeleteModalComponent,
    CustomTableComponent
  ],
  templateUrl: './employee-table-page.component.html',
  styleUrls: ['./employee-table-page.component.css'],
})
export class EmployeeTablePageComponent {
  
  public searchTerm = '';
  public selectedEmployee: EmployeeInterface | null = null;
  public employeeToDelete: EmployeeInterface | null = null;
  public showEmployeeModal = false;
  public showDeleteModal = false;

  public readonly employeeColumns: TableColumn[] = [
  { key: 'employeeId', label: 'ID', sortable: true },
  { key: 'employeeName', label: 'Name' },
  { key: 'employeeAge', label: 'Age', sortable: true },
  { key: 'employeeDepartment', label: 'Department' },
  { key: 'employeeRole', label: 'Role' },
];

public readonly employeeSearchKeys = [
  'employeeName',
  'employeeId',
];
  
  private employeeService = inject(EmployeeService);
  private authService = inject(AuthService);
  public readonly employees = this.employeeService.employees;

  public get canAdd(): boolean {
    return this.authService.hasPermission('add');
  }

  public get canEdit(): boolean {
    return this.authService.hasPermission('edit');
  }

  public get canDelete(): boolean {
    return this.authService.hasPermission('delete');
  }


  public onSearchChange(value: InputValue): void {
    this.searchTerm = String(value ?? '').trim();
  }

  public openAddModal(): void {
    if (!this.canAdd) {
      return;
    }
    this.selectedEmployee = null;
    this.showEmployeeModal = true;
  }

  public openEditModal(employee: EmployeeInterface): void {
    if (!this.canEdit) {
      return;
    }
    this.selectedEmployee = employee;
    this.showEmployeeModal = true;
  }

  public closeEmployeeModal(): void {
    this.selectedEmployee = null;
    this.showEmployeeModal = false;
  }

  public saveEmployee(employee: EmployeeInterface): void {
    if (this.selectedEmployee) {
      if (this.canEdit) {
        this.employeeService.updateEmployee(employee);
      }
    } else if (this.canAdd) {
      this.employeeService.addEmployee(employee);
    }

    this.closeEmployeeModal();
  }

  public requestDelete(employee: EmployeeInterface): void {
    if (!this.canDelete) {
      return;
    }
    this.employeeToDelete = employee;
    this.showDeleteModal = true;
  }

  public confirmDelete(employee: EmployeeInterface | null): void {
    if (!employee || !this.canDelete) {
      this.cancelDelete();
      return;
    }

    this.employeeService.deleteEmployee(employee.employeeId);
    this.cancelDelete();
  }

  public cancelDelete(): void {
    this.employeeToDelete = null;
    this.showDeleteModal = false;
  }

  public onTableAction(event: TableActionEvent): void {
   const employee = event.row as EmployeeInterface;

   switch (event.action) {
    case 'edit':
      this.openEditModal(employee);
      break;

    case 'delete':
      this.requestDelete(employee);
      break;
  }
  }
}
