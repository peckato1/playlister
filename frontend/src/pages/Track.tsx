import { useParams, Outlet } from 'react-router';
import useApi from '../hooks/useApiQuery';
import Loading from '../components/Loading';
import Typography from '@mui/material/Typography';
import NavTabs from '../components/NavTabs';

export default function Page() {
  const { trackId } = useParams();
  const query = useApi({ resource: `tracks/${trackId}` });

  if (query.isLoading) return <Loading />

  return (
    <>
      <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
        {query.data.interpret.name} - {query.data.name}
      </Typography>

      <NavTabs tabs={[{ label: 'Last played', href: '.' }]} />

      <Outlet />
    </>
  );
}
