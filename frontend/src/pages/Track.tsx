import { useParams, Outlet } from 'react-router';
import useApi from '../hooks/useApiQuery';
import Loading from '../components/Loading';
import NavTabs from '../components/NavTabs';
import TitleAndServiceLinks from '../components/TitleAndServiceLinks';

export default function Page() {
  const { trackId } = useParams();
  const query = useApi({ resource: `tracks/${trackId}` });

  if (query.isLoading) return <Loading />

  return (
    <>
      <TitleAndServiceLinks interpret={query.data.interpret.name} track={query.data.name} />

      <NavTabs tabs={[{ label: 'Last played', href: '.' }]} />

      <Outlet />
    </>
  );
}
