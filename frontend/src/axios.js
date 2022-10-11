import axios from 'axios';

const instance = axios.create({
    baseUrl:'http://localhost:4444',
})

instance.interceptors.request.use((config)=>{
    config.headers.Authorization=window.localStorage.getItems('token');

    return config;
})

export default instance;