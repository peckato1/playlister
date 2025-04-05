import {
  type MRT_PaginationState,
  type MRT_ColumnFiltersState,
  type MRT_SortingState,
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

export interface QueryParameters<T> {
  set?: React.Dispatch<React.SetStateAction<T>>;
  data?: T;
}

export interface DataGridProps<T> {
  paginatedData: Paginated<T>;
  pagination: QueryParameters<MRT_PaginationState>;
  columnFilters: QueryParameters<MRT_ColumnFiltersState>;
  sorting: QueryParameters<MRT_SortingState>;
}

export interface ConcreteDataGridProps<T> extends DataGridProps<T> {
  enableColumnFilters?: Record<string, boolean>;
}
