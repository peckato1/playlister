import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { axios, DEFAULT_PAGE_SIZE } from '../config'

interface Pagination {
  pageIndex: number;
  pageSize: number;
}

interface ColumnFilter {
  id: string;
  value: unknown;
}

type QueryParams = Record<string, string|number>;

interface ApiQueryProps {
  resource: string;
  params?: QueryParams;
  pagination?: boolean;
}

function nextPage(pagination: Pagination) {
  return {
    pageIndex: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
  }
}

function constructQueryKey(resource: string, apiOptions: QueryParams) {
  return [resource, apiOptions]
}

function qPagination(pagination?: Pagination): QueryParams {
  if (!pagination) {
    return {}
  }
  return {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  }
}

function qSearch(columnFilters: ColumnFilter[]): QueryParams {
  if (columnFilters.length === 0) {
    return {};
  }
  return {
    query: columnFilters.map(e => `${e.id}~=${e.value}`).join(";")
  }
}

interface ConstructQueryParamsProps {
  pagination?: Pagination;
  columnFilters: ColumnFilter[];
  queryParams?: QueryParams
}
function constructQueryParams({ pagination, columnFilters, queryParams }: ConstructQueryParamsProps): QueryParams {
  return {
    ...qPagination(pagination),
    ...qSearch(columnFilters),
    ...(queryParams || {}),
  }
}

async function fetchApi({ resource, signal, queryParams } : { resource: string, signal: AbortSignal, queryParams: QueryParams }) {
  const { data } = await axios.get(resource, {
    params: queryParams,
    signal: signal,
  })
  return data
}

export function useApiQuery(props: ApiQueryProps) {
  const queryClient = useQueryClient()
  const [pagination, setPagination] = useState<Pagination>({
    pageIndex: 0 /* 0-based due to compatibility with material-react-table */,
    pageSize: DEFAULT_PAGE_SIZE,
  })
  const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([])

  const isPaginationEnabled = props.pagination === true
  const queryParams = constructQueryParams({
    pagination: isPaginationEnabled ? pagination : undefined,
    columnFilters,
    queryParams: props.params,
  })

  const query = useQuery({
    queryKey: constructQueryKey(props.resource, queryParams),
    queryFn: ({ signal }) => fetchApi({
      resource: props.resource,
      signal: signal,
      queryParams: queryParams,
    }),
    placeholderData: previousData => previousData,
  })

  // prefetch next page
  if (isPaginationEnabled) {
    const nextPageQueryParams = constructQueryParams({
      pagination: nextPage(pagination),
      columnFilters,
      queryParams:props.params,
    })
    queryClient.prefetchQuery({
      queryKey: constructQueryKey(props.resource, nextPageQueryParams),
      queryFn: ({ signal }) => fetchApi({
        resource: props.resource,
        signal: signal,
        queryParams: nextPageQueryParams,
      }),
    })
  }

  return {
    query: query,
    pagination: {
      data: isPaginationEnabled ? pagination : undefined,
      set: isPaginationEnabled ? setPagination : undefined,
    },
    columnFilters: {
      data: columnFilters,
      set: setColumnFilters,
    },
  }
}
