export interface Station {
  id: number;
  name: string;
  loader_interval: string | null;
}

export interface Interpret {
  id: number;
  name: string;
}

export interface Track {
  id: number;
  name: string;
  interpret: Interpret;
}

export interface TrackPlayed {
  start: string;
  synced_at: string;
  station: Station;
  track: Track;
}
