import { useApiQuery } from '../hooks/useApiQuery';
import { useParams } from 'react-router';
import DataGridFactory from '../components/datagrid/DataGridFactory';
import Loading from '../components/Loading';

export default function InterpretTrackList() {
  const { interpretId } = useParams();
  const apiQuery = useApiQuery({ resource: `interprets/${interpretId}/tracks`, pagination: true });

  if (apiQuery.query.isLoading) return <Loading />

  return (
    <DataGridFactory
      type="track"
      paginatedData={apiQuery.query.data}
      setPagination={apiQuery.setPagination}
      enableColumnFilters={{'interpret.name': false}}
    />
  )
}

