import axios from 'axios'
import router from '@/router'
import { Message } from 'element-ui'
import { TOKEN_KEY, TIP_DURATION_TIME } from '@/utils/constant'

// create an axios instance
const service = axios.create({
  timeout: 10000 // request timeout
})

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (sessionStorage.getItem(TOKEN_KEY)) {
    config.headers['X-Auth-Token'] = sessionStorage.getItem(TOKEN_KEY) // 让每个请求携带token-- ['X-Auth-Token']为自定义key 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log('error.....')
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => response,
  error => {
    if (error.response !== undefined) {
      switch (error.response.status) {
        case 401:
          Message({
            message: '会话过期，请重新登录',
            type: 'warning',
            duration: TIP_DURATION_TIME
          })
          sessionStorage.removeItem(TOKEN_KEY)
          router.push('/login')
          break
        case 302:
          return Promise.resolve(error.response)
        default:
          console.log('err' + error) // for debug
          Message({
            message: error.message,
            type: 'error',
            duration: TIP_DURATION_TIME
          })
      }
    } else {
      Message({
        message: '会话过期，请重新登录',
        type: 'warning',
        duration: TIP_DURATION_TIME
      })
      sessionStorage.removeItem(TOKEN_KEY)
      router.push('/login')
    }
    return Promise.reject(error)
  })

export default service
