import axios from 'axios';

const api = axios.create({
    baseURL:"https://orbital-25-sbk1.vercel.app/"
})

export default api;