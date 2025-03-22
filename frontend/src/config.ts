import Axios from "axios";

export const axios = Axios.create({
  baseURL: import.meta.env.VITE_API_BASEURL + "/v1/",
})

export const DEFAULT_PAGE_SIZE = 50
