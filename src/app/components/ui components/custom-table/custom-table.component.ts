import { Component, EventEmitter, Input, Output } from '@angular/core';

import {
  TableColumn,
  TableActionEvent,
} from '../../../interfaces/table.interface';

type SortDirection = 'asc' | 'desc';

@Component({
  selector: 'app-custom-table',
  standalone: true,
  templateUrl: './custom-table.component.html',
  styleUrls: ['./custom-table.component.css'],
})
export class CustomTableComponent {
  @Input() rows: object[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() searchTerm = '';
  @Input() searchKeys: string[] = [];

  @Input() canEdit = false;
  @Input() canDelete = false;

  @Output() rowAction = new EventEmitter<TableActionEvent>();

  public sortField = '';
  public sortDirection: SortDirection = 'asc';

  public get showActions(): boolean {
    return this.canEdit || this.canDelete;
  }

  public get displayedRows(): object[] {
    const term = this.searchTerm.trim().toLowerCase();

    let result = [...this.rows];

    if (term) {
      result = result.filter((row) =>
        this.searchKeys.some((key) =>
          String(this.getCellValue(row, key))
            .toLowerCase()
            .includes(term),
        ),
      );
    }

    if (this.sortField) {
      result.sort((a, b) => {
        const left = this.getCellValue(a, this.sortField);
        const right = this.getCellValue(b, this.sortField);

        const comparison =
          typeof left === 'number' && typeof right === 'number'
            ? left - right
            : String(left).localeCompare(String(right));

        return this.sortDirection === 'asc'
          ? comparison
          : -comparison;
      });
    }

    return result;
  }

  public getCellValue(row: object, key: string): string | number {
    const value = (row as Record<string, unknown>)[key];

    if (typeof value === 'string' || typeof value === 'number') {
      return value;
    }

    return '';
  }

  public toggleSort(column: TableColumn): void {
    if (!column.sortable) {
      return;
    }

    if (this.sortField === column.key) {
      this.sortDirection =
        this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = column.key;
      this.sortDirection = 'asc';
    }
  }

  public emitAction(action: 'edit' | 'delete', row: object): void {
    this.rowAction.emit({ action, row });
  }
}