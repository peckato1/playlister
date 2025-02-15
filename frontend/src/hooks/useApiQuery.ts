import { useQuery } from '@tanstack/react-query'
import { axios } from '../config'

interface QueryParams {
  [key: string]: string | number
}
async function fetchApi(resource: string, signal: AbortSignal, queryParams?: QueryParams) {
  const { data } = await axios.get(resource, {
    params: queryParams || {},
    signal: signal,
  })
  return data
}

export default function useApi({ resource, queryParams } : { resource: string, queryParams?: QueryParams }) {
  const query = useQuery({
    queryKey: [resource, queryParams],
    queryFn: ({ signal }) => fetchApi(resource, signal, queryParams),
  })

  return query
}
