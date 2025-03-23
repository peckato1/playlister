import type { MRT_ColumnDef } from 'material-react-table';
import { useMemo } from 'react';
import { Station } from '../../model';
import Link from '../../components/Link';
import DataGrid from './DataGrid';
import { DataGridProps } from './types';

export default function StationDataGrid(props: DataGridProps<Station>) {
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
        enableColumnFilter: props.enableColumnFilters?.['name'],
      },
      {
        id: 'loader_interval',
        accessorKey: 'station.loader_interval',
        header: 'Loader interval',
        Cell: ({ renderedCellValue }) => {
          return renderedCellValue || "N/A";
        },
        enableColumnFilter: props.enableColumnFilters?.['station.loader_interval'],
      },
    ],
    [props.enableColumnFilters],
  );

  return <DataGrid columns={columns} paginatedData={props.data} hiddenColumns={['loader_interval']} setPagination={props.setPagination} />
};
