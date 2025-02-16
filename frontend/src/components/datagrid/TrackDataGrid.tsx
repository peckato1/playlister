import { useMemo } from 'react';
import type { MRT_ColumnDef } from 'material-react-table';
import { Track } from '../../model';
import Link from '../../components/Link';
import DataGrid from './DataGrid';

export default function TrackDataGrid({ data }: { data: Track[] }) {
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

  return <DataGrid columns={columns} data={data} />
};
