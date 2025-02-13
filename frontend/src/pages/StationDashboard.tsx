import { useQuery } from '@tanstack/react-query';
import { Station } from '../model';
import Loading from '../components/Loading';
import { env } from '../config';

import Typography from '@mui/material/Typography';
import DataGrid from '../components/datagrid/StationDataGrid';

export default function Page() {
  const { isLoading, data } = useQuery({
    queryKey: ['stations'],
    queryFn: () => fetch(`${env('VITE_API_BASEURL')}/v1/stations`).then((res) => res.json()),
  });

  if (isLoading) return <Loading />

  return (
    <>
      <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
        Stations
      </Typography>

      <DataGrid data={data as Station[]} />
    </>
  );
}
