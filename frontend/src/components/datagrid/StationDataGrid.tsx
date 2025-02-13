import type { MRT_ColumnDef } from 'material-react-table';
import { useMemo } from 'react';
import { Station } from '../../model';
import Link from '../../components/Link';
import DataGrid from './DataGrid';

export default function StationDataGrid({ data }: { data: Station[] }) {
  const columns = useMemo<MRT_ColumnDef<Station>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Station',
        Cell: ({ renderedCellValue, row }) => (
          <Link to={`/stations/${row.original.id}`}>
            {renderedCellValue}
          </Link>
        ),
      },
      {
        id: 'loader_interval',
        accessorKey: 'station.loader_interval',
        header: 'Loader interval',
        Cell: ({ renderedCellValue }) => {
          return renderedCellValue || "N/A";
        }
      },
      {
        accessorKey: 'station.loader_interval',
        header: 'Last track time',
      },
    ],
    [],
  );

  return <DataGrid columns={columns} data={data} hiddenColumns={['loader_interval']} />
};
