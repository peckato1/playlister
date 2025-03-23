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
        accessorKey: 'station.name',
        header: 'Station',
        Cell: ({ renderedCellValue, row }) => (
          <Link to={`/stations/${row.original.station.id}`}>
            {renderedCellValue}
          </Link>
        ),
        enableColumnFilter: props.enableColumnFilters?.['station.name'],
      },
      {
        accessorKey: 'track.interpret.name',
        header: 'Interpret',
        Cell: ({ renderedCellValue, row }) => (
          <Link to={`/interprets/${row.original.track.interpret.id}`}>
            {renderedCellValue}
          </Link>
        ),
        enableColumnFilter: props.enableColumnFilters?.['track.interpret.name'],
      },
      {
        accessorKey: 'track.name',
        header: 'Track',
        Cell: ({ renderedCellValue, row }) => (
          <Link to={`/tracks/${row.original.track.id}`}>
            {renderedCellValue}
          </Link>
        ),
        enableColumnFilter: props.enableColumnFilters?.['track.name'],
      },
      {
        accessorFn: (originalRow) => dayjs(originalRow.start),
        filterVariant: 'datetime-range',
        header: 'Start',
        Cell: ({ cell }) => <TimeWithRelative time={cell.getValue<dayjs.Dayjs>()} />,
        enableColumnFilter: props.enableColumnFilters?.['start'],
      },
      {
        accessorFn: (originalRow) => dayjs(originalRow.synced_at),
        filterVariant: 'datetime-range',
        header: 'Sync time',
        Cell: ({ cell }) => <TimeWithRelative time={cell.getValue<dayjs.Dayjs>()} />,
        id: 'synced',
        enableColumnFilter: props.enableColumnFilters?.['synced'],
      },
    ],
    [props.enableColumnFilters],
  );

  return <DataGrid columns={columns} hiddenColumns={['synced']} {...props} />
};
