import { useParams, Outlet } from 'react-router';
import useApi from '../hooks/useApiQuery';
import Loading from '../components/Loading';
import DataGrid from '../components/datagrid/TrackPlayedDataGrid';
import Typography from '@mui/material/Typography';

export default function Page() {
  const { trackId } = useParams();
  const { isLoading, data } = useApi({ resource: `tracks/${trackId}` });
  const { isLoading: isLoading2, data: data2 } = useApi({ resource: `tracks/${trackId}/played` });

  if (isLoading) return <Loading />
  if (isLoading2) return <Loading />

  return (
    <>
      <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
        {data.interpret.name} - {data.name}
      </Typography>

      <Outlet />
      <DataGrid data={data2} />
    </>
  );
}
