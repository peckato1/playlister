import {
  type MRT_PaginationState,
  type MRT_ColumnFiltersState,
} from 'material-react-table'

export interface Paginated<T> {
  pagination: {
    page: number;
    last_page: number;
    limit: number;
    total: number;
  };
  data: T[];
}

export interface DataGridProps<T> {
  paginatedData: Paginated<T>;
  setPagination?: React.Dispatch<React.SetStateAction<MRT_PaginationState>>;
  setColumnFilters?: React.Dispatch<React.SetStateAction<MRT_ColumnFiltersState>>;
}

export interface ConcreteDataGridProps<T> extends DataGridProps<T> {
  enableColumnFilters?: Record<string, boolean>;
}
