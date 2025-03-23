import type { MRT_ColumnDef } from 'material-react-table';
import { useMemo } from 'react';
import { Station } from '../../model';
import Link from '../../components/Link';
import DataGrid from './DataGrid';
import { ConcreteDataGridProps } from './types';

export default function StationDataGrid(props: ConcreteDataGridProps<Station>) {
  const columns = useMemo<MRT_ColumnDef<Station>[]>(
    () => [
      {
        id: 'station',
        accessorKey: 'name',
        header: 'Station',
        Cell: ({ renderedCellValue, row }) => (
          <Link to={`/stations/${row.original.id}`}>
            {renderedCellValue}
          </Link>
        ),
        enableColumnFilter: props.enableColumnFilters?.['station'],
      },
      {
        id: 'loader_interval',
        accessorKey: 'station.loader_interval',
        header: 'Loader interval',
        Cell: ({ renderedCellValue }) => {
          return renderedCellValue || "N/A";
        },
        enableColumnFilter: props.enableColumnFilters?.['loader_interval'],
      },
    ],
    [props.enableColumnFilters],
  );

  return <DataGrid columns={columns} hiddenColumns={['loader_interval']} {...props} />
};
