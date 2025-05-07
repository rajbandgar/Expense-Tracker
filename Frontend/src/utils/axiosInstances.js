import axios from 'axios';
import { BASE_URL } from './apiPaths';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
})

// Add a request interceptor to include the token in the headers

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('token');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

// Add a response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
    (response)=> {
        return response;

    },
    error => {
        //handling common errors globally

        if(error.response){
            if(error.response.status === 401){
                // Handle unauthorized access (e.g., redirect to login page)
                
                window.location.href = '/login';
        } else if(error.response.status === 500){
            console.error('Server error:', error.response.data);
        }
        }else if (error.code === "ECONNABORTED") {
            console.error('Request timed out: Please try again later.');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
