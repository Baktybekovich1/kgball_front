import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

const API_URL = 'https://kgball.dragocorp.tw1.su'

// Создаем экземпляр Axios с настройками по умолчанию
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


