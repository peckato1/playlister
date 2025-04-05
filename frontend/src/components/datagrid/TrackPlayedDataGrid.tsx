import { useMemo } from 'react';
import dayjs from 'dayjs';
import type { MRT_ColumnDef } from 'material-react-table';
import { TrackPlayed } from '../../model';
import Link from '../../components/Link';
import TimeWithRelative from '../../components/TimeWithRelative';
import DataGrid from './DataGrid';
import { ConcreteDataGridProps } from './types';

export default function TrackPlayedDataGrid(props: ConcreteDataGridProps<TrackPlayed>) {
  const columns = useMemo<MRT_ColumnDef<TrackPlayed>[]>(
    () => [
      {
        id: 'station',
        accessorKey: 'station.name',
        header: 'Station',
        Cell: ({ renderedCellValue, row }) => (
          <Link to={`/stations/${row.original.station.id}`}>
            {renderedCellValue}
          </Link>
        ),
        enableColumnFilter: props.enableColumnFilters?.['station'],
      },
      {
        id: 'interpret',
        accessorKey: 'track.interpret.name',
        header: 'Interpret',
        Cell: ({ renderedCellValue, row }) => (
          <Link to={`/interprets/${row.original.track.interpret.id}`}>
            {renderedCellValue}
          </Link>
        ),
        enableColumnFilter: props.enableColumnFilters?.['interpret'],
      },
      {
        id: 'track',
        accessorKey: 'track.name',
        header: 'Track',
        Cell: ({ renderedCellValue, row }) => (
          <Link to={`/tracks/${row.original.track.id}`}>
            {renderedCellValue}
          </Link>
        ),
        enableColumnFilter: props.enableColumnFilters?.['track'],
      },
      {
        id: 'start',
        accessorFn: (originalRow) => dayjs(originalRow.start),
        filterVariant: 'datetime-range',
        header: 'Start',
        Cell: ({ cell }) => <TimeWithRelative time={cell.getValue<dayjs.Dayjs>()} />,
        enableColumnFilter: true,
      },
      {
        id: 'synced',
        accessorFn: (originalRow) => dayjs(originalRow.synced_at),
        filterVariant: 'datetime-range',
        header: 'Sync time',
        Cell: ({ cell }) => <TimeWithRelative time={cell.getValue<dayjs.Dayjs>()} />,
        enableColumnFilter: false,
      },
    ],
    [props.enableColumnFilters],
  );

  return <DataGrid columns={columns} hiddenColumns={['synced']} {...props} />
};
