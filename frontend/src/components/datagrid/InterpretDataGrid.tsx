import { useMemo } from 'react';
import type { MRT_ColumnDef } from 'material-react-table';
import { Interpret } from '../../model';
import Link from '../../components/Link';
import DataGrid from './DataGrid';
import { ConcreteDataGridProps } from './types';

export default function TrackDataGrid(props: ConcreteDataGridProps<Interpret>) {
  const columns = useMemo<MRT_ColumnDef<Interpret>[]>(
    () => [
      {
        id: 'interpret',
        accessorKey: 'name',
        header: 'Interpret',
        Cell: ({ renderedCellValue, row }) => (
          <Link to={`/interprets/${row.original.id}`}>
            {renderedCellValue}
          </Link>
        ),
        enableColumnFilter: props.enableColumnFilters?.['interpret'],
      },
    ],
    [props.enableColumnFilters],
  );

  return <DataGrid columns={columns} {...props} />
};

