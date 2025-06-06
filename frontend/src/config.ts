import Axios from "axios";
import dayjs from "dayjs";

export const axios = Axios.create({
  baseURL: import.meta.env.VITE_API_BASEURL + "/v1/",
})

export const DEFAULT_PAGE_SIZE = 50
export const DATAGRID_PAGE_SIZE_OPTIONS = [5, 25, 50, 100, 200, 500]
export const DATAGRID_MIN_DATE = dayjs("2025-01-01")
