import { flyConfig, requestContextConfig, commonConfig } from './config.js'
import Fly from 'flyio/dist/npm/wx'
const fly = new Fly()
fly.config = flyConfig
// 添加请求拦截器
fly.interceptors.request.use((request) => {
  // 设置header
  const token = uni.getStorageSync('accessToken')
  if (token !== undefined && token.length > 0) {
    request.headers['accessToken'] = token
  }
  // 设置公共参数
  const userId = uni.getStorageSync('userId')
  console.log(userId !== undefined && userId.length > 0)
  if (userId !== undefined && userId.length > 0) {
    requestContextConfig.userId = userId
  }
  const body = request.body ? request.body : {}
  body.context = requestContextConfig
  request.body = body

  return request
})

// 添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
  (response) => {
    return response
  },

  (error) => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = '请求错误(400)'
          break
        case 401:
          commonConfig.loginCallback()
          error.message = '您的登录状态已失效，请重新登录'
          uni.removeStorageSync('accessToken')
          uni.removeStorageSync('userId')
          uni.removeStorageSync('avatarUrl')
          break
        case 403:
          commonConfig.noPermissionCallback()
          error.message = '拒绝访问(403)'
          break
        case 404:
          error.message = `请求地址出错: ${error.response.config.url}`
          break
        case 405:
          error.message = '请求方法未允许(405)'
          break
        case 408:
          error.message = '请求超时(408)'
          break
        case 500:
          error.message = '服务器内部错误(500)'
          break
        case 501:
          error.message = '服务未实现(501)'
          break
        case 502:
          error.message = '网络错误(502)'
          break
        case 503:
          error.message = '服务不可用(503)'
          break
        case 504:
          error.message = '网络超时(504)'
          break
        case 505:
          error.message = 'HTTP版本不受支持(505)'
          break
        default:
          error.message = `连接错误: ${error.message}`
          break
      }
    } else {
      error.message = '连接到服务器失败，请联系管理员'
    }
    return Promise.reject(error)
  }
)

export default fly
