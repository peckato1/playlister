import Loading from '../components/Loading';
import { useApiQuery } from '../hooks/useApiQuery';
import Typography from '@mui/material/Typography';
import DataGridFactory from '../components/datagrid/DataGridFactory';

export default function Page() {
  const apiQuery = useApiQuery({ resource: '/tracks', pagination: true });

  if (apiQuery.query.isLoading) return <Loading />

  return (
    <>
      <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
        Tracks
      </Typography>

      <DataGridFactory
        type="track"
        paginatedData={apiQuery.query.data}
        setPagination={apiQuery.setPagination}
      />
    </>
  );
}
