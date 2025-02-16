import { useParams, Outlet } from 'react-router';
import Loading from '../components/Loading';
import Typography from '@mui/material/Typography';
import useApi from '../hooks/useApiQuery';
import NavTabs from '../components/NavTabs';

export default function Page() {
  const { interpretId } = useParams();
  const queryInterpret = useApi({ resource: `interprets/${interpretId}` });

  if (queryInterpret.isLoading) return <Loading />

  return (
    <>
      <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
        {queryInterpret.data.name}
      </Typography>

      <NavTabs tabs={[{ label: 'Last played', href: '.' }, { label: 'Track list', href: 'tracks' }]} />

      <Outlet/>
    </>
  );
}
