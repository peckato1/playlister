import { useParams, Outlet } from 'react-router';
import Loading from '../components/Loading';
import Typography from '@mui/material/Typography';
import useApi from '../hooks/useApiQuery';
import DataGridFactory from '../components/datagrid/DataGridFactory';

export default function Page() {
  const { interpretId } = useParams();
  const queryInterpret = useApi({ resource: `interprets/${interpretId}` });
  const queryPlayed = useApi({ resource: `interprets/${interpretId}/played` });

  if (queryInterpret.isLoading || queryPlayed.isLoading) return <Loading />

  return (
    <>
      <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
        {queryInterpret.data.name}
      </Typography>

      <Outlet />
      <DataGridFactory type="trackplayed" data={queryPlayed.data} />
    </>
  );
}
