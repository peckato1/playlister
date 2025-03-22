import {
  type MRT_PaginationState,
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
  data: Paginated<T>;
  setPagination?: React.Dispatch<React.SetStateAction<MRT_PaginationState>>
}
