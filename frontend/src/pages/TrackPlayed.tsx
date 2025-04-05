import { useApiQuery } from '../hooks/useApiQuery';
import { useParams } from 'react-router';
import DataGridFactory from '../components/datagrid/DataGridFactory';
import Loading from '../components/Loading';

export default function TrackPlayed() {
  const { trackId } = useParams();
  const apiQuery = useApiQuery({ resource: `tracks/${trackId}/played`, pagination: true });

  if (apiQuery.query.isLoading) return <Loading />

  return (
    <DataGridFactory
      type="trackplayed"
      paginatedData={apiQuery.query.data}
      pagination={apiQuery.pagination}
      columnFilters={apiQuery.columnFilters}
      enableColumnFilters={{
        'interpret': false,
        'track': false,
      }}
    />
  )
}
