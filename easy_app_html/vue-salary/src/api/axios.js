import axios from 'axios'
import * as config from '../config.js'
import querystring from 'querystring'
// import { loginIn } from '../utils/loginIn'
// import app from '../main'

const ax = axios.create({
  baseURL: config.API_ROOT,
  timeout: 5000
})

// 拦截器
ax.interceptors.request.use(config => {
  setTimeout(() => {
    console.log(config)
  })
  console.log(config.data)
  if (
    config.method === 'post' ||
    config.method === 'put' ||
    config.method === 'delete' ||
    config.method === 'patch'
  ) {
    config.data = querystring.stringify(config.data)
  }
  return config
}, error => {
  return Promise.reject(error)
})

ax.interceptors.response.use(response => {
  if (response.code === -2) window.localtion = '/logout'
  return response
}, error => {
  // if (!loginIn()) {
  //   app.$alert('用户信息已过期，请点击确定后重新登录。', '提示', {
  //     confirmButtonText: '确定',
  //     callback: action => app.$router.push({
  //       path: '/login',
  //       query: { redirect: app.$route.fullPath }
  //     })
  //   })
  // }
  return Promise.reject(error)
})

export default ax
