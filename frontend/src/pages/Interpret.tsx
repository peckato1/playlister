import { useQuery } from '@tanstack/react-query';
import { useParams, Outlet } from 'react-router';
import Loading from '../components/Loading';
import DataGrid from '../components/datagrid/TrackPlayedDataGrid';
import { env } from '../config';
import Typography from '@mui/material/Typography';

export default function Page() {
  const { interpretId } = useParams();
  const { isLoading, data } = useQuery({
    queryKey: ['interprets', interpretId],
    queryFn: () => fetch(`${env('VITE_API_BASEURL')}/v1/interprets/${interpretId}`).then((res) => res.json()),
  });

  const { isLoading: isLoading2, data: data2 } = useQuery({
    queryKey: ['interprets', interpretId, "played"],
    queryFn: () => fetch(`${env('VITE_API_BASEURL')}/v1/interprets/${interpretId}/played`).then((res) => res.json()),
  });

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
