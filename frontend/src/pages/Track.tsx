import { useParams, Outlet } from 'react-router';
import useApi from '../hooks/useApiQuery';
import Loading from '../components/Loading';
import DataGridFactory from '../components/datagrid/DataGridFactory';
import Typography from '@mui/material/Typography';

export default function Page() {
  const { trackId } = useParams();
  const queryTrack = useApi({ resource: `tracks/${trackId}` });
  const queryPlayed = useApi({ resource: `tracks/${trackId}/played` });

  if (queryTrack.isLoading || queryPlayed.isLoading) return <Loading />

  return (
    <>
      <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
        {queryTrack.data.interpret.name} - {queryTrack.data.name}
      </Typography>

      <Outlet />
      <DataGridFactory type="trackplayed" data={queryPlayed.data} />
    </>
  );
}
