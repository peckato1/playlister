import { useState } from 'react';
import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import RadioIcon from '@mui/icons-material/Radio';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: theme.palette.divider,
  backgroundColor: alpha(theme.palette.background.default, 0.4),
  boxShadow: theme.shadows[1],
  padding: '8px 12px',
}));

interface LinkItem {
  text: string;
  link: string;
}
const links = [[{
  text: 'Stations',
  link: '/stations',
}, {
  text: 'Interprets',
  link: '/interprets',
}, {
  text: 'Tracks',
  link: '/tracks',
}], [{
  text: 'About',
  link: '/about',
}]];

function LinkGroup({ links, variant }: { links: LinkItem[], variant: 'classic' | 'dropdown' }) {
  if (variant === 'classic') {
    return (
      <div style={{ display: 'flex', gap: 1 }}>
        {links.map((item) => (
          <Button component={Link} to={item.link} variant="text" color="info" size="small" key={item.link}>
            {item.text}
          </Button>
        ))}
      </div>
    )
  } else {
    return links.map((item) => (
      <MenuItem key={item.link}>
        {item.text}
      </MenuItem>
    ))
  }
}

function Links({ links, variant }: { links: LinkItem[][], variant: 'classic' | 'dropdown' }) {
  const res = links.map((group, i) => (
    <LinkGroup links={group} variant={variant} key={i} />
  ))

  if (variant === 'classic') {
    return (
      <Box sx={{ display: 'flex', gap: 1, width: "100%", justifyContent: "space-between" }}>
        {res}
      </Box>
    )
  } else {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: "100%" }}>
        <MenuItem>
          Home
        </MenuItem>
        {res}
      </Box>
    )
  }
}

function Logo() {
  return (
    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
      <Stack alignItems="center" direction="row" gap={2}>
        <RadioIcon />
        <Typography variant="subtitle1">PLAYLISTER</Typography>
      </Stack>
    </Link>
  )
}

export default function AppAppBar() {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setDrawerOpen(newOpen);
  };

  return (
    <AppBar
      position="static"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
      <Container maxWidth={false}>
        <StyledToolbar variant="dense" disableGutters>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, justifyContent: "flex-start", gap: 1, width: "100%" }}>
            <Grid container spacing={2} sx={{width: "100%"}}>
              <Grid size={{sm: 4, md: 2, lg: 2, xl: 1}} sx={{color: 'text.primary'}}>
                <Logo />
              </Grid>
              <Grid size={{sm: 8, md: 10, lg: 10, xl: 11}}>
                <Links links={links} variant="classic" />
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, justifyContent: "space-between", gap: 1, width: "100%", color: 'text.primary' }}>
            <Logo />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
          </Box>
          <Drawer
            anchor="top"
            open={isDrawerOpen}
            onClose={toggleDrawer(false)}
            PaperProps={{
              sx: {
                top: 'var(--template-frame-height, 0px)',
              },
            }}
          >
            <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <IconButton onClick={toggleDrawer(false)}>
                  <MenuIcon />
                </IconButton>
              </Box>
              <Links links={links} variant='dropdown' />
            </Box>
          </Drawer>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
