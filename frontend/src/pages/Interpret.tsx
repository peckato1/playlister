import { useParams, Outlet } from 'react-router';
import Loading from '../components/Loading';
import { useApiQuery } from '../hooks/useApiQuery';
import NavTabs from '../components/NavTabs';
import TitleAndServiceLinks from '../components/TitleAndServiceLinks';

export default function Page() {
  const { interpretId } = useParams();
  const apiQuery = useApiQuery({ resource: `interprets/${interpretId}`, pagination: false });

  if (apiQuery.query.isLoading) return <Loading />

  return (
    <>
      <TitleAndServiceLinks interpret={apiQuery.query.data.name} />

      <NavTabs tabs={[{ label: 'Last played', href: '.' }, { label: 'Track list', href: 'tracks' }]} />

      <Outlet/>
    </>
  );
}
