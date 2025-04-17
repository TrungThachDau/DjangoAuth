import axios from 'axios';
const axiosInstance = axios.create({
// eslint-disable-next-line no-process-env
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
