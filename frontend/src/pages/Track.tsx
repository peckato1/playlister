import { useParams, Outlet } from 'react-router';
import { useApiQuery } from '../hooks/useApiQuery';
import Loading from '../components/Loading';
import NavTabs from '../components/NavTabs';
import TitleAndServiceLinks from '../components/TitleAndServiceLinks';

export default function Page() {
  const { trackId } = useParams();
  const apiQuery = useApiQuery({ resource: `tracks/${trackId}`, pagination: false });

  if (apiQuery.query.isLoading) return <Loading />

  return (
    <>
      <TitleAndServiceLinks interpret={apiQuery.query.data.interpret.name} track={apiQuery.query.data.name} />

      <NavTabs tabs={[{ label: 'Last played', href: '.' }]} />

      <Outlet />
    </>
  );
}
