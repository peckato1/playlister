import { useParams, Outlet } from 'react-router';
import Loading from '../components/Loading';
import useApi from '../hooks/useApiQuery';
import NavTabs from '../components/NavTabs';
import TitleAndServiceLinks from '../components/TitleAndServiceLinks';

export default function Page() {
  const { interpretId } = useParams();
  const queryInterpret = useApi({ resource: `interprets/${interpretId}` });

  if (queryInterpret.isLoading) return <Loading />

  return (
    <>
      <TitleAndServiceLinks interpret={queryInterpret.data.name} />

      <NavTabs tabs={[{ label: 'Last played', href: '.' }, { label: 'Track list', href: 'tracks' }]} />

      <Outlet/>
    </>
  );
}
