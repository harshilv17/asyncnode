import axios from "axios"
import { config } from "@/config/config"
import refreshToken from "@/services/auth/refreshToken"

const api = axios.create({
  baseURL: config.backend_URI,
  withCredentials: true,
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config

    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/token/refresh")
    ) {
      originalRequest._retry = true

      const status = await refreshToken()
      if (status === 200) {
        return api(originalRequest)
      }
    }

    return Promise.reject(error)
  }
)

export default api
