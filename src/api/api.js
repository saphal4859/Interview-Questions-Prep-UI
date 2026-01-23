import axios from 'axios'

export const api = axios.create({
 baseURL: import.meta.env.VITE_API_BASE_URL
 //baseURL: 'http://localhost:8080'
})
