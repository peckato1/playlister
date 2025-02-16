import { useMemo } from 'react';
import type { MRT_ColumnDef } from 'material-react-table';
import { Interpret } from '../../model';
import Link from '../../components/Link';
import DataGrid from './DataGrid';

export default function TrackDataGrid({ data }: { data: Interpret[] }) {
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
      },
    ],
    [],
  );

  return <DataGrid columns={columns} data={data} />
};

