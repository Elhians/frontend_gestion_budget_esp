import axios from 'axios';

const httpClient = axios.create({
    baseURL: 'https://api-gestion-budget-esp.onrender.com/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

httpClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

httpClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.response) {
            console.error('Erreur HTTP:', error.response.status, error.response.data);
        } else {
            console.error('Erreur réseau:', error.message);
        }
        return Promise.reject(error);
    }
);

export default httpClient;