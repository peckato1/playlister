import Loading from '../components/Loading';
import useApi from '../hooks/useApiQuery';
import Typography from '@mui/material/Typography';
import DataGridFactory from '../components/datagrid/DataGridFactory';

export default function Page() {
  const { isLoading, data } = useApi({ resource: '/stations' });

  if (isLoading) return <Loading />

  return (
    <>
      <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
        Stations
      </Typography>

      <DataGridFactory type="station" data={data} />
    </>
  );
}
