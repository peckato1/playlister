import { useApiQuery } from '../hooks/useApiQuery';
import { useParams } from 'react-router';
import DataGridFactory from '../components/datagrid/DataGridFactory';
import Loading from '../components/Loading';

export default function InterpretPlayed() {
  const { interpretId } = useParams();
  const apiQuery = useApiQuery({ resource: `interprets/${interpretId}/played`, pagination: true });

  if (apiQuery.query.isLoading) return <Loading />

  return <DataGridFactory type="trackplayed" data={apiQuery.query.data} setPagination={apiQuery.setPagination} />
}

