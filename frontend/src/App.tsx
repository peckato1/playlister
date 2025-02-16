import { BrowserRouter, Route, Routes } from "react-router";
import SiteBar from './components/Bar';
import { Container } from '@mui/material';

import Home from './pages/Home';
import StationDashboard from './pages/StationDashboard';
import Station from './pages/Station';
import Interpret from './pages/Interpret';
import InterpretDashboard from './pages/InterpretDashboard';
import InterpretTrackList from './pages/InterpretTrackList';
import InterpretPlayed from './pages/InterpretPlayed';
import Track from './pages/Track';
import TrackDashboard from './pages/TrackDashboard';
import TrackPlayed from './pages/TrackPlayed';
import About from './pages/About';

function App() {
  return (
    <>
      <Container maxWidth={false}>
        <BrowserRouter basename="/playlister">
          <SiteBar />
          <Container maxWidth={false} sx={{
              mt: 2,
          }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/stations">
                <Route index element={<StationDashboard />} />
                <Route path=":stationId">
                  <Route index element={<Station />} />
                </Route>
              </Route>
              <Route path="/interprets">
                <Route index element={<InterpretDashboard />} />
                <Route path=":interpretId" element={<Interpret />}>
                  <Route index element={<InterpretPlayed />} />
                  <Route path="tracks" element={<InterpretTrackList />} />
                </Route>
              </Route>
              <Route path="/tracks">
                <Route index element={<TrackDashboard />} />
                <Route path=":trackId" element={<Track />}>
                  <Route index element={<TrackPlayed />} />
                </Route>
              </Route>
              <Route path="/about" element={<About />} />
            </Routes>
          </Container>
        </BrowserRouter>
      </Container>
    </>
  )
}

export default App
