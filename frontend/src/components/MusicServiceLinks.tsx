import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import Tooltip from '@mui/material/Tooltip';
import {
  SiSpotify,
  SiApplemusic,
  SiYoutube,
  SiGoogle,
  SiDuckduckgo,
} from "react-icons/si";
import { FaDeezer } from 'react-icons/fa';
import { IconType } from 'react-icons';

interface TrackProps {
  interpret: string;
  track?: string;
}

interface Service {
  name: string;
  href: string;
  icon: IconType;
}

interface ServiceBadgeProps extends TrackProps {
  service: Service;
}

const services: Service[] = [
  {
    name: 'Spotify',
    href: 'https://open.spotify.com/search/{query}',
    icon: SiSpotify,
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/results?search_query={query}',
    icon: SiYoutube,
  },
  {
    name: 'Apple Music',
    href: 'https://music.apple.com/search?term={query}',
    icon: SiApplemusic,
  },
  {
    name: 'Deezer',
    href: 'https://www.deezer.com/search/{query}',
    icon: FaDeezer,
  },
  {
    name: 'Google',
    href: 'https://www.google.com/search?q={query}',
    icon: SiGoogle,
  },
  {
    name: 'DuckDuckGo',
    href: 'https://www.duckduckgo.com/?q={query}',
    icon: SiDuckduckgo,
  },
]

function constructMusicServiceSearchUrl(href: string, interpret: string, track?: string) {
  const query = interpret + (track ? ` - ${track}` : '');
  return href.replace('{query}', encodeURIComponent(query));
}

function ServiceBadge(props: ServiceBadgeProps) {
  const Icon = props.service.icon;
  return (
    <Tooltip
      title={`Search on ${props.service.name}`}
    >
      <Link
        href={constructMusicServiceSearchUrl(props.service.href, props.interpret, props.track)}
        underline="none"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Avatar
          sx={{ width: 40, height: 40 }}
        >
          <Icon />
        </Avatar>
      </Link>
    </Tooltip>
  );
}

export default function MusicServiceLinks(props: TrackProps) {
  return (
    <Stack direction="row" spacing={1}>
      {services.map((service: Service) => <ServiceBadge key={service.name} service={service} interpret={props.interpret} track={props.track} />)}
    </Stack>
  );
}
