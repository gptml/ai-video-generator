import axios from "axios";

const api = axios.create({
  baseURL: 'https://1541b8ebb5bc.ngrok-free.app',
})

api.interceptors.request.use((config) => {
  config.headers.Authorization = localStorage.getItem("token");
  return config;
}, (error) => Promise.reject(error))

export default class Api {
  static login(data) {
    return api.post('/users/login', data)
  }

  static generateVideo(model, data) {
    return api.post(`/video-generator/generate/${model}`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
  }

  static checkStatus({ taskId, path }) {
    return api.get(`/video-generator/check-status`, { params: { taskId, path } })
  }
}
