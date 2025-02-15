import { useParams, Outlet } from 'react-router';
import Loading from '../components/Loading';
import DataGrid from '../components/datagrid/TrackPlayedDataGrid';
import Typography from '@mui/material/Typography';
import useApi from '../hooks/useApiQuery';

export default function Page() {
  const { interpretId } = useParams();
  const { isLoading, data } = useApi({ resource: `interprets/${interpretId}` });
  const { isLoading: isLoading2, data: data2 } = useApi({ resource: `interprets/${interpretId}/played` });

  if (isLoading) return <Loading />
  if (isLoading2) return <Loading />

  return (
    <>
      <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
        {data.name}
      </Typography>

      <Outlet />
      <DataGrid data={data2} />
    </>
  );
}
