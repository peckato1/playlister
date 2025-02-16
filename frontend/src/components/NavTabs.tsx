import { useState, MouseEvent, SyntheticEvent } from 'react';
import { Link as RouterLink } from 'react-router';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

interface LinkTabProps {
  label?: string;
  to: string;
  selected?: boolean;
}

function LinkTab(props: LinkTabProps) {
  return (
    <Tab
      component={RouterLink}
      aria-current={props.selected}
      {...props}
    />
  );
}

function samePageLinkNavigation(event: MouseEvent) {
  return !(
    event.defaultPrevented ||
    event.button !== 0 || // ignore everything but left-click
    event.metaKey ||
    event.ctrlKey ||
    event.altKey ||
    event.shiftKey
  )
}

interface Props {
  tabs: { label: string; href: string }[];
}
export default function NavTabs(props: Props) {
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    // from mui docs
    if (event.type !== 'click' || (event.type === 'click' && samePageLinkNavigation(event as MouseEvent))) {
      setValue(newValue);
    }
  };
  const tabs = props.tabs.map((tab, index) => (
    <LinkTab
      key={index}
      label={tab.label}
      to={tab.href}
      selected={index === value}
    />
  ));

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        role="navigation"
        centered
      >
        {tabs}
      </Tabs>
    </Box>
  );
}
