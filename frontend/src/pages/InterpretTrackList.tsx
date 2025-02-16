import useApi from '../hooks/useApiQuery';
import { useParams } from 'react-router';
import DataGridFactory from '../components/datagrid/DataGridFactory';
import Loading from '../components/Loading';

export default function InterpretTrackList() {
  const { interpretId } = useParams();
  const query = useApi({ resource: `interprets/${interpretId}/tracks` });

  if (query.isLoading) return <Loading />

  return <DataGridFactory type="track" data={query.data} />
}

