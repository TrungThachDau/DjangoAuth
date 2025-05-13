import axios from 'axios';
const axiosInstance = axios.create({
// eslint-disable-next-line no-process-env
    baseURL: 'http://localhost:8000/api',
    withCredentials: true,
});
export default axiosInstance;
