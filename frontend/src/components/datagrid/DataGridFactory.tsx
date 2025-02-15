import StationDataGrid from './StationDataGrid'
import TrackPlayedDataGrid from './TrackPlayedDataGrid'

import { Station, TrackPlayed } from '../../model'

export type DataGridType = 'station' | 'interpret' | 'track' | 'trackplayed'

export default function DataGridFactory({ type, data } : { type: DataGridType, data: any }) {
  switch (type) {
    case 'station':
      return <StationDataGrid data={data as Station[]} />
    case 'trackplayed':
      return <TrackPlayedDataGrid data={data as TrackPlayed[]} />
    default:
      throw new Error(`Unknown DataGridType: '${type}'`)
  }
}
