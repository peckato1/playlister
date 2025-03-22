import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { axios, DEFAULT_PAGE_SIZE } from '../config'

interface Pagination {
  pageIndex: number;
  pageSize: number;
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

function constructQueryParams(pagination?: Pagination, queryParams: QueryParams = {}): QueryParams {
  if (!pagination) {
    return queryParams
  }

  return {
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    ...queryParams,
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

  const isPaginationEnabled = props.pagination === true
  const queryParams = constructQueryParams(isPaginationEnabled ? pagination : undefined, props.params)

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
    const nextPageQueryParams = constructQueryParams(nextPage(pagination), props.params)
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
    setPagination: isPaginationEnabled ? setPagination : undefined,
  }
}
