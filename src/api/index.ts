import axios from 'axios';
const BACK_URL = process.env.REACT_APP_BACK_URL;
const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;

const instance = axios.create({
  baseURL: `${BACK_URL}:${BACK_PORT}`,
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
