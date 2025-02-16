import useApi from '../hooks/useApiQuery';
import { useParams } from 'react-router';
import DataGridFactory from '../components/datagrid/DataGridFactory';
import Loading from '../components/Loading';

export default function TrackPlayed() {
  const { trackId } = useParams();
  const query = useApi({ resource: `tracks/${trackId}/played` });

  if (query.isLoading) return <Loading />

  return <DataGridFactory type="trackplayed" data={query.data} />
}
