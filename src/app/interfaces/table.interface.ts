export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

export interface TableActionEvent {
  action: 'edit' | 'delete';
  row: object;
}