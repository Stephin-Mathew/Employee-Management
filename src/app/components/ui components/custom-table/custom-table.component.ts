import {Component,computed,effect,EventEmitter,input,Output,signal} from '@angular/core';

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
  readonly rows = input<object[]>([]);
  readonly columns = input<TableColumn[]>([]);
  readonly searchTerm = input('');
  readonly searchKeys = input<string[]>([]);

  readonly canEdit = input(false);
  readonly canDelete = input(false);

  @Output() rowAction = new EventEmitter<TableActionEvent>();

  public sortField = signal('');
  public sortDirection = signal<SortDirection>('asc');

  public currentPage = signal(1);
  private readonly resetPageOnInputChange = effect(() => {
    this.rows();
    this.searchTerm();
    this.currentPage.set(1);
  });
  public pageSize = signal(8);
  public readonly pageSizeOptions = [5, 8, 10, 20, 50];

  public readonly showActions = computed(() =>
    this.canEdit() || this.canDelete(),
  );

  public readonly filteredAndSortedRows = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();

    let result = [...this.rows()];

    if (term) {
      result = result.filter((row) =>
        this.searchKeys().some((key) =>
          String(this.getCellValue(row, key))
            .toLowerCase()
            .includes(term),
        ),
      );
    }

    if (this.sortField()) {
      result.sort((a, b) => {
        const left = this.getCellValue(a, this.sortField());
        const right = this.getCellValue(b, this.sortField());

        const comparison =
          typeof left === 'number' && typeof right === 'number'
            ? left - right
            : String(left).localeCompare(String(right));

        return this.sortDirection() === 'asc'
          ? comparison
          : -comparison;
      });
    }

    return result;
  });

  public readonly displayedRows = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize();

    return this.filteredAndSortedRows().slice(
      startIndex,
      startIndex + this.pageSize(),
    );
  });

  public readonly totalItems = computed(() =>
    this.filteredAndSortedRows().length,
  );

  public readonly totalPages = computed(() =>
    Math.ceil(this.totalItems() / this.pageSize()),
  );

  public readonly startItem = computed(() =>
    this.totalItems() === 0
      ? 0
      : (this.currentPage() - 1) * this.pageSize() + 1,
  );

  public readonly endItem = computed(() =>
    Math.min(this.currentPage() * this.pageSize(), this.totalItems()),
  );

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

    if (this.sortField() === column.key) {
      this.sortDirection.set(
        this.sortDirection() === 'asc' ? 'desc' : 'asc',
      );
    } else {
      this.sortField.set(column.key);
      this.sortDirection.set('asc');
    }
  }

  public emitAction(action: 'edit' | 'delete', row: object): void {
    this.rowAction.emit({ action, row });
  }

  public goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) {
      return;
    }

    this.currentPage.set(page);
  }

  public previousPage(): void {
    this.goToPage(this.currentPage() - 1);
  }

  public nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  public onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;

    this.pageSize.set(Number(select.value));
    this.currentPage.set(1);
  }

}