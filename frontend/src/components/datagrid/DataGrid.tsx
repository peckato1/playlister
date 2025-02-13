import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  type MRT_TableOptions,
  type MRT_RowData,
} from 'material-react-table'

interface Props<T extends MRT_RowData> extends MRT_TableOptions<T> {
  data: T[]
  columns: MRT_ColumnDef<T>[]
  hiddenColumns?: string[]
}
interface HiddenColumns {
  [key: string]: boolean
}

export default function DataGrid<T extends MRT_RowData>(props: Props<T>) {
  const data = props.data
  const columns = props.columns
  const hiddenColumns = (props.hiddenColumns ?? []).reduce((acc: HiddenColumns, col: string) => {
    acc[col] = false
    return acc
  }, {} as HiddenColumns)

  const table = useMaterialReactTable<T>({
    columns,
    data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableDensityToggle: false,
    initialState: {
      columnVisibility: hiddenColumns,
      pagination: { pageSize: 100, pageIndex: 0 },
      density: 'compact',
    },
    muiPaginationProps: {
      rowsPerPageOptions: [25, 50, 100, 200, 500],
      showFirstButton: true,
      showLastButton: true,
    },
  })

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MaterialReactTable table={table} />
    </LocalizationProvider>
  )
}
