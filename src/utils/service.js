import axios from "axios";

const http = axios.create({
  baseURL: '/api',
  timeout: 10000,
  // withCredentials: true, // 前端设置了这个，后端的Access-Control-Allow-Origin字段就必须指定源地址，不能为*
  headers: {
    'Content-Type': 'application/json'
  }
})

// 添加请求拦截器
http.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
http.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  if(response.status === 200 && response.data.code === 200) {
    return response.data
  }
  return Promise.reject(response)
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

export default http