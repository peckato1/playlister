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
  switch (props.type) {
    case 'station':
      return <StationDataGrid data={props.data as Paginated<Station>} setPagination={props.setPagination} />
    case 'interpret':
      return <InterpretDataGrid data={props.data as Paginated<Track>} setPagination={props.setPagination} />
    case 'track':
      return <TrackDataGrid data={props.data as Paginated<Track>} setPagination={props.setPagination} />
    case 'trackplayed':
      return <TrackPlayedDataGrid data={props.data as Paginated<TrackPlayed>} setPagination={props.setPagination} />
    default:
      throw new Error(`Unknown DataGridType: '${props.type}'`)
  }
}
