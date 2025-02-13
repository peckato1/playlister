import { BrowserRouter, Route, Routes } from "react-router";
import SiteBar from './components/Bar';
import { Container } from '@mui/material';

import Home from './pages/Home';
import StationDashboard from './pages/StationDashboard';
import Station from './pages/Station';
import Interpret from './pages/Interpret';
import Track from './pages/Track';
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
                <Route index />
                <Route path=":interpretId">
                  <Route index element={<Interpret />} />
                </Route>
              </Route>
              <Route path="/tracks">
                <Route index />
                <Route path=":trackId">
                  <Route index element={<Track />} />
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
