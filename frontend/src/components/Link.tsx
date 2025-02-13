import { Link as RouterLink } from 'react-router';
import { Link as MuiLink } from '@mui/material';

export default function Link({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <MuiLink component={RouterLink} to={to} color="inherit" underline="hover">
      {children}
    </MuiLink>
  );
}
