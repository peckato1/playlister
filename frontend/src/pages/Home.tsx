import { useQuery } from '@tanstack/react-query';
import Loading from '../components/Loading';
import DataGrid from '../components/datagrid/TrackPlayedDataGrid';
import { TrackPlayed } from '../model';
import { env } from '../config';
import Typography from '@mui/material/Typography';

export default function Page() {
  const { isLoading, data } = useQuery({
    queryKey: ['played'],
    queryFn: () => fetch(`${env('VITE_API_BASEURL')}/v1/played`).then((res) => res.json()),
  });

  if (isLoading) return <Loading />

  return (
    <>
      <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
        Latest Tracks
      </Typography>
      <DataGrid data={data as TrackPlayed[]} />
    </>
  );
}
