import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EmployeeInterface } from '../../interfaces/employee.interface';

type SortField = 'employeeId' | 'employeeAge';
type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-employee-table',
  standalone: true,
  templateUrl: './employee-table.component.html',
  styleUrls: ['./employee-table.component.css'],
})
export class EmployeeTableComponent implements OnInit {
  @Input() employees: EmployeeInterface[] = [];
  @Input() searchTerm = '';
  @Input() canEdit = false;
  @Input() canDelete = false;
  
  @Output() editEmployee = new EventEmitter<EmployeeInterface>();
  @Output() deleteEmployee = new EventEmitter<EmployeeInterface>();

  public sortDirection: SortDirection = 'asc';
  public sortField: SortField = 'employeeId';

  // The Actions column only exists if the user can edit or delete.
  public get showActions(): boolean {
    return this.canEdit || this.canDelete;
  }

  public ngOnInit(): void {
    this.resetSortState();
  }
 
  public filteredEmployees(): EmployeeInterface[] {
    const term = this.searchTerm.trim().toLowerCase();
    const sortedEmployees = [...this.employees].sort((left, right) => {
      const comparison =
        this.sortField === 'employeeId'
          ? left.employeeId - right.employeeId
          : left.employeeAge - right.employeeAge;
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });

    if (!term) {
      return sortedEmployees;
    }

    return sortedEmployees.filter(
      (employee) =>
        employee.employeeName.toLowerCase().includes(term) ||
        employee.employeeId.toString().includes(term),
    );
  }

  // Clicking the active column flips its direction; clicking the other
  // column switches to it, starting ascending.
  public toggleSort(field: SortField): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      return;
    }

    this.sortField = field;
    this.sortDirection = 'asc';
  }

  public getAriaSort(field: SortField): 'ascending' | 'descending' | 'none' {
    if (this.sortField !== field) {
      return 'none';
    }

    return this.sortDirection === 'asc' ? 'ascending' : 'descending';
  }

  private resetSortState(): void {
    this.sortField = 'employeeId';
    this.sortDirection = 'asc';
  }
}
