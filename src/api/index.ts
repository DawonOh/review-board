import axios from 'axios';
const BACK_URL = process.env.REACT_APP_BACK_URL;

const instance = axios.create({
  baseURL: `${BACK_URL}`,
  timeout: 5000,
  headers: {
    Accept: 'application/json',
  },
});
instance.interceptors.request.use(
  config => {
    const token = sessionStorage.getItem('token');
    config.headers.Authorization = token;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default instance;
