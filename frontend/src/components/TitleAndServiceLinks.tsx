import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MusicServiceLinks from './MusicServiceLinks';

interface Props {
  interpret: string;
  track?: string;
}

export default function TitleAndServiceLinks(props: Props) {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: {'xs': 'column', 'md': 'row'},
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      mb: 3,
    }}>
      <Typography variant="h4" component="h2" sx={{ mb: 2, mr: 3 }}>
        {props.interpret} {props.track ? `- ${props.track}` : ''}
      </Typography>

      <MusicServiceLinks interpret={props.interpret} track={props.track} />
    </Box>
  );
}
