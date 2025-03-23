import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import type { Paginated } from './types'
import * as config from '../../config'
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_RowData,
  type MRT_Updater,
  MRT_PaginationState,
} from 'material-react-table'

interface Props<T extends MRT_RowData> {
  paginatedData: Paginated<T>
  hiddenColumns?: string[]
  columns: MRT_ColumnDef<T>[]
  setPagination?: React.Dispatch<React.SetStateAction<MRT_PaginationState>>
}

type HiddenColumns = Record<string, boolean>

export default function DataGrid<T extends MRT_RowData>(props: Props<T>) {
  const data = props.paginatedData.data
  const columns = props.columns
  const hiddenColumns = (props.hiddenColumns ?? []).reduce((acc: HiddenColumns, col: string) => {
    acc[col] = false
    return acc
  }, {} as HiddenColumns)

  const handlePaginationChange = (updater: MRT_Updater<MRT_PaginationState>) => {
    if (props.setPagination) {
      props.setPagination((prevPagination: MRT_PaginationState) =>
        typeof updater === 'function' ? updater(prevPagination) : updater
      );
    }
  };

  const table = useMaterialReactTable<T>({
    columns,
    data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableDensityToggle: false,
    initialState: {
      columnVisibility: hiddenColumns,
      density: 'compact',
      showColumnFilters: true,
    },
    state: {
      pagination: {
        pageIndex: props.paginatedData.pagination.page - 1,
        pageSize: props.paginatedData.pagination.limit,
      },
    },
    rowCount: props.paginatedData.pagination.total,
    manualPagination: true,
    onPaginationChange: handlePaginationChange,
    muiPaginationProps: {
      rowsPerPageOptions: config.DATAGRID_PAGE_SIZE_OPTIONS,
      showFirstButton: true,
      showLastButton: true,
    },
    muiFilterDateTimePickerProps: {
      ampm: false,
      ampmInClock: false,
      minDate: config.DATAGRID_MIN_DATE as unknown as undefined /* bypassing "Type 'Dayjs' is not assignable to type 'undefined'." */,
      maxDate: dayjs().endOf('day') as unknown as undefined,
      yearsOrder: 'desc',
      viewRenderers: {
        hours: renderTimeViewClock,
        minutes: renderTimeViewClock,
        seconds: renderTimeViewClock,
      }
    },
  })

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MaterialReactTable table={table} />
    </LocalizationProvider>
  )
}
