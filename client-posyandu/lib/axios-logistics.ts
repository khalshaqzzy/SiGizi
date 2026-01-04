import axios from 'axios';
import Cookies from 'js-cookie';

const apiLogistics = axios.create({
  baseURL: process.env.NEXT_PUBLIC_LOGISTICS_API_URL || 'http://localhost:5002/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiLogistics.interceptors.request.use((config) => {
  const token = Cookies.get('sigizi_posyandu_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiLogistics;
