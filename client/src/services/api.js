import axios from 'axios';


const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  withCredentials: true, 
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
}, (error) => {
  return Promise.reject(error);
});

export default API;
