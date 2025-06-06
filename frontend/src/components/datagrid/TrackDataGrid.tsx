import { useMemo } from 'react';
import type { MRT_ColumnDef } from 'material-react-table';
import { Track } from '../../model';
import Link from '../../components/Link';
import DataGrid from './DataGrid';
import { ConcreteDataGridProps } from './types';

export default function TrackDataGrid(props: ConcreteDataGridProps<Track>) {
  const columns = useMemo<MRT_ColumnDef<Track>[]>(
    () => [
      {
        id: 'interpret',
        accessorKey: 'interpret.name',
        header: 'Interpret',
        Cell: ({ renderedCellValue, row }) => (
          <Link to={`/interprets/${row.original.interpret.id}`}>
            {renderedCellValue}
          </Link>
        ),
        enableColumnFilter: props.enableColumnFilters?.['interpret'],
      },
      {
        id: 'track',
        accessorKey: 'name',
        header: 'Track',
        Cell: ({ renderedCellValue, row }) => (
          <Link to={`/tracks/${row.original.id}`}>
            {renderedCellValue}
          </Link>
        ),
        enableColumnFilter: props.enableColumnFilters?.['track'],
      },
    ],
    [props.enableColumnFilters],
  );

  return <DataGrid columns={columns} {...props} />
};
