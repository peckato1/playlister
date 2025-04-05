import Loading from '../components/Loading';
import DataGridFactory from '../components/datagrid/DataGridFactory';
import Typography from '@mui/material/Typography';
import { useApiQuery } from '../hooks/useApiQuery';

export default function Page() {
  const apiQuery = useApiQuery({ resource: '/played', pagination: true });

  if (apiQuery.query.isLoading) return <Loading />

  return (
    <>
      <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
        Latest Tracks
      </Typography>

      <DataGridFactory
        type="trackplayed"
        paginatedData={apiQuery.query.data}
        setPagination={apiQuery.pagination.set}
        setColumnFilters={apiQuery.columnFilters.set}
      />
    </>
  );
}
