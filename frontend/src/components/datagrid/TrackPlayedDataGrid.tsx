import { useMemo } from 'react';
import dayjs from 'dayjs';
import type { MRT_ColumnDef } from 'material-react-table';
import { TrackPlayed } from '../../model';
import Link from '../../components/Link';
import TimeWithRelative from '../../components/TimeWithRelative';
import DataGrid from './DataGrid';

export default function TrackPlayedDataGrid({ data }: { data: TrackPlayed[] }) {
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
      },
      {
        accessorKey: 'track.interpret.name',
        header: 'Interpret',
        Cell: ({ renderedCellValue, row }) => (
          <Link to={`/interprets/${row.original.track.interpret.id}`}>
            {renderedCellValue}
          </Link>
        ),
      },
      {
        accessorKey: 'track.name',
        header: 'Track',
        Cell: ({ renderedCellValue, row }) => (
          <Link to={`/tracks/${row.original.track.id}`}>
            {renderedCellValue}
          </Link>
        ),
      },
      {
        accessorFn: (originalRow) => dayjs(originalRow.start),
        filterVariant: 'datetime-range',
        header: 'Start',
        Cell: ({ cell }) => <TimeWithRelative time={cell.getValue<dayjs.Dayjs>()} />,
      },
      {
        accessorFn: (originalRow) => dayjs(originalRow.synced_at),
        filterVariant: 'datetime-range',
        header: 'Sync time',
        Cell: ({ cell }) => <TimeWithRelative time={cell.getValue<dayjs.Dayjs>()} />,
        id: 'synced',
      },
    ],
    [],
  );

  return <DataGrid columns={columns} data={data} hiddenColumns={['synced']} />
};
