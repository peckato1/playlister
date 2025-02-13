import { useQuery } from '@tanstack/react-query';
import { useParams, Outlet } from 'react-router';
import Loading from '../components/Loading';
import DataGrid from '../components/datagrid/TrackPlayedDataGrid';
import { env } from '../config';
import Typography from '@mui/material/Typography';

export default function Page() {
  const { trackId } = useParams();
  const { isLoading, data } = useQuery({
    queryKey: ['tracks', trackId],
    queryFn: () => fetch(`${env('VITE_API_BASEURL')}/v1/tracks/${trackId}`).then((res) => res.json()),
  });

  const { isLoading: isLoading2, data: data2 } = useQuery({
    queryKey: ['tracks', trackId, "played"],
    queryFn: () => fetch(`${env('VITE_API_BASEURL')}/v1/tracks/${trackId}/played`).then((res) => res.json()),
  });

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
