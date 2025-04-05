import Loading from '../components/Loading';
import { useApiQuery } from '../hooks/useApiQuery';
import Typography from '@mui/material/Typography';
import DataGridFactory from '../components/datagrid/DataGridFactory';

export default function Page() {
  const apiQuery = useApiQuery({ resource: '/interprets', pagination: true });

  if (apiQuery.query.isLoading) return <Loading />

  return (
    <>
      <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
        Interprets
      </Typography>

      <DataGridFactory
        type="interpret"
        paginatedData={apiQuery.query.data}
        setPagination={apiQuery.pagination.set}
        setColumnFilters={apiQuery.columnFilters.set}
      />
    </>
  );
}
