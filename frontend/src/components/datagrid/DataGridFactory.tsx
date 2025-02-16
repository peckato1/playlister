import InterpretDataGrid from './InterpretDataGrid'
import StationDataGrid from './StationDataGrid'
import TrackDataGrid from './TrackDataGrid'
import TrackPlayedDataGrid from './TrackPlayedDataGrid'

import { Station, Track, TrackPlayed } from '../../model'

export type DataGridType = 'station' | 'interpret' | 'track' | 'trackplayed'

export default function DataGridFactory({ type, data } : { type: DataGridType, data: any }) {
  switch (type) {
    case 'station':
      return <StationDataGrid data={data as Station[]} />
    case 'interpret':
      return <InterpretDataGrid data={data as Track[]} />
    case 'track':
      return <TrackDataGrid data={data as Track[]} />
    case 'trackplayed':
      return <TrackPlayedDataGrid data={data as TrackPlayed[]} />
    default:
      throw new Error(`Unknown DataGridType: '${type}'`)
  }
}
