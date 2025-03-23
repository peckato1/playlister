import InterpretDataGrid from './InterpretDataGrid'
import StationDataGrid from './StationDataGrid'
import TrackDataGrid from './TrackDataGrid'
import TrackPlayedDataGrid from './TrackPlayedDataGrid'

import { Paginated, DataGridProps } from './types'
import { Station, Track, TrackPlayed } from '../../model'

type DataGridType = 'station' | 'interpret' | 'track' | 'trackplayed'

interface Props<T> extends DataGridProps<T> {
  type: DataGridType
}

export default function DataGridFactory<T>(props: Props<T>) {
  const { data, type, ...passthrough } = props
  switch (type) {
    case 'station':
      return <StationDataGrid data={data as Paginated<Station>} {...passthrough} />
    case 'interpret':
      return <InterpretDataGrid data={data as Paginated<Track>} {...passthrough} />
    case 'track':
      return <TrackDataGrid data={data as Paginated<Track>} {...passthrough} />
    case 'trackplayed':
      return <TrackPlayedDataGrid data={data as Paginated<TrackPlayed>} {...passthrough} />
    default:
      throw new Error(`Unknown DataGridType: '${type}'`)
  }
}
