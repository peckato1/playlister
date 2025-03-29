import { useParams, Outlet } from 'react-router';
import Loading from '../components/Loading';
import DataGridFactory from '../components/datagrid/DataGridFactory';
import Typography from '@mui/material/Typography';
import { useApiQuery } from '../hooks/useApiQuery';

export default function Page() {
  const { stationId } = useParams();
  const apiQueryStation = useApiQuery({ resource: `/stations/${stationId}`, pagination: false });
  const apiQueryPlayed = useApiQuery({ resource: `/stations/${stationId}/played`, pagination: true });

  if (apiQueryStation.query.isLoading || apiQueryPlayed.query.isLoading) return <Loading />

  return (
    <>
      <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
        {apiQueryStation.query.data.name}
      </Typography>

      <Outlet />
      <DataGridFactory
        type="trackplayed"
        paginatedData={apiQueryPlayed.query.data}
        setPagination={apiQueryPlayed.setPagination}
        setColumnFilters={apiQueryPlayed.setColumnFilters}
        enableColumnFilters={{
          'station': false,
          'synced': false,
        }}
      />
    </>
  );
}
