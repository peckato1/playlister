import Loading from '../components/Loading';
import DataGrid from '../components/datagrid/TrackPlayedDataGrid';
import { TrackPlayed } from '../model';
import Typography from '@mui/material/Typography';
import useApi from '../hooks/useApiQuery';

export default function Page() {
  const { isLoading, data } = useApi({
    resource: '/played',
  })

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
