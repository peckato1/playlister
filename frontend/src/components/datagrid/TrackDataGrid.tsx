import { useMemo } from 'react';
import type { MRT_ColumnDef } from 'material-react-table';
import { Track } from '../../model';
import Link from '../../components/Link';
import DataGrid from './DataGrid';
import { DataGridProps } from './types';

export default function TrackDataGrid(props: DataGridProps<Track>) {
  const columns = useMemo<MRT_ColumnDef<Track>[]>(
    () => [
      {
        accessorKey: 'interpret.name',
        header: 'Interpret',
        Cell: ({ renderedCellValue, row }) => (
          <Link to={`/interprets/${row.original.interpret.id}`}>
            {renderedCellValue}
          </Link>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Track',
        Cell: ({ renderedCellValue, row }) => (
          <Link to={`/tracks/${row.original.id}`}>
            {renderedCellValue}
          </Link>
        ),
      },
    ],
    [],
  );

  return <DataGrid<Track> columns={columns} paginatedData={props.data} setPagination={props.setPagination} />
};
