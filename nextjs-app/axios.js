import axios from 'axios';
const axiosInstance = axios.create({
// eslint-disable-next-line no-process-env
    baseURL: 'https://localhost:7160/api',
    withCredentials: false,
});
export default axiosInstance;
