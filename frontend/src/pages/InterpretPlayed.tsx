import useApi from '../hooks/useApiQuery';
import { useParams } from 'react-router';
import DataGridFactory from '../components/datagrid/DataGridFactory';
import Loading from '../components/Loading';

export default function InterpretPlayed() {
  const { interpretId } = useParams();
  const query = useApi({ resource: `interprets/${interpretId}/played` });

  if (query.isLoading) return <Loading />

  return <DataGridFactory type="trackplayed" data={query.data} />
}

