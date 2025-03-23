import { useMemo } from 'react';
import type { MRT_ColumnDef } from 'material-react-table';
import { Interpret } from '../../model';
import Link from '../../components/Link';
import DataGrid from './DataGrid';
import { DataGridProps } from './types';

export default function TrackDataGrid(props: DataGridProps<Interpret>) {
  const columns = useMemo<MRT_ColumnDef<Interpret>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Interpret',
        Cell: ({ renderedCellValue, row }) => (
          <Link to={`/interprets/${row.original.id}`}>
            {renderedCellValue}
          </Link>
        ),
        enableColumnFilter: props.enableColumnFilters?.['name'],
      },
    ],
    [props.enableColumnFilters],
  );

  return <DataGrid columns={columns} paginatedData={props.data} setPagination={props.setPagination} />
};

