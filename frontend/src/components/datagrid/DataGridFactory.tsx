import InterpretDataGrid from './InterpretDataGrid'
import StationDataGrid from './StationDataGrid'
import TrackDataGrid from './TrackDataGrid'
import TrackPlayedDataGrid from './TrackPlayedDataGrid'

import { Paginated, ConcreteDataGridProps } from './types'
import { Station, Track, TrackPlayed } from '../../model'

type DataGridType = 'station' | 'interpret' | 'track' | 'trackplayed'

interface Props<T> extends ConcreteDataGridProps<T> {
  type: DataGridType
}

export default function DataGridFactory<T>(props: Props<T>) {
  const { paginatedData, type, ...passthrough } = props
  switch (type) {
    case 'station':
      return <StationDataGrid paginatedData={paginatedData as Paginated<Station>} {...passthrough} />
    case 'interpret':
      return <InterpretDataGrid paginatedData={paginatedData as Paginated<Track>} {...passthrough} />
    case 'track':
      return <TrackDataGrid paginatedData={paginatedData as Paginated<Track>} {...passthrough} />
    case 'trackplayed':
      return <TrackPlayedDataGrid paginatedData={paginatedData as Paginated<TrackPlayed>} {...passthrough} />
    default:
      throw new Error(`Unknown DataGridType: '${type}'`)
  }
}
