import { useParams, Outlet } from 'react-router';
import Loading from '../components/Loading';
import DataGrid from '../components/datagrid/TrackPlayedDataGrid';
import Typography from '@mui/material/Typography';
import useApi from '../hooks/useApiQuery';

export default function Page() {
  const { stationId } = useParams();
  const queryStation = useApi({ resource: `/stations/${stationId}` });
  const queryPlayed = useApi({ resource: `/stations/${stationId}/played` });

  if (queryStation.isLoading || queryPlayed.isLoading) return <Loading />

  return (
    <>
      <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
        {queryStation.data.name}
      </Typography>

      <Outlet />
      <DataGrid data={queryPlayed.data} />
    </>
  );
}
