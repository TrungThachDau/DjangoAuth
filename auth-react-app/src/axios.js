import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://18.138.112.170/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
