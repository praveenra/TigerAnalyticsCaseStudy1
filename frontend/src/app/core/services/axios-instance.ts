import { environment } from '../../../environments/environment';
import axios, { AxiosRequestConfig } from 'axios';

const api = axios.create({
  baseURL: environment.apiUrl,
  withCredentials: true // cookies
});

api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config as AxiosRequestConfig & { _retry?: boolean };
    
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Refresh token request

        const { data } = await axios.post(`${environment.apiUrl}auth/refresh`, {
          refreshToken: localStorage.getItem('refreshToken')
        });

        // Store new access token if using headers
        // localStorage.setItem('access_token', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        

        // Set header for retry (optional if backend accepts cookies)
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${data.accessToken}`
        };

        // Retry original request
        return axios(originalRequest);
      } catch (refreshErr) {
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(err);
  }
);

export default api;
