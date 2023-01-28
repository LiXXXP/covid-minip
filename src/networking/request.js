import fly from './index.js'
import { commonConfig } from './config.js'

export default class Request {
  config = {
    url: '',
    method: 'post',
    params: {},
    isLoading: false,
    isMessage: false,
    isError: false,
    config: {},
    replyCodes: []
  }
  constructor(config) {
    this.config = Object.assign(this.config, config)
  }

  async start() {
    let response
    let error
    try {
      if (this.config.isLoading) {
        uni.showLoading({
          title: '加载中'
        })
      }
      if (this.config.method === 'get') {
        response = await fly.get(this.config.url, {
          params: this.config.params
        })
      } else {
        response = await fly.post(
          this.config.url,
          {
            ...this.config.params
          },
          this.config.config
        )
      }
      const replayCode = response.data.status.replyCode
      if (!response.data.status.success && !this.config.replyCodes.includes(replayCode)) {
        let message = response.data.status.replyText
        if (response.data.status.errorCode === '401') {
          commonConfig.businessNoPermissionCallback()
        } else if (response.data.status.errorCode === '403') {
          commonConfig.requestUserRoleResCallback()
        } else if (response.data.status.errorCode === '9') {
          message = '系统开了小差，请刷新试试！'
          commonConfig.serverErrorCallback()
        }
        const err = {
          message: message,
          response: response.data
        }
        throw err
      }
    } catch (e) {
      // TODO handle the exception
      error = e
      if (this.config.isMessage) {
        const msg = e.message || '网络开了小差，请刷新试试！'
        msg &&
          uni.showToast({
            icon: 'none',
            title: msg
          })
      }
    } finally {
      if (this.config.isLoading) {
        uni.hideLoading()
      }
    }
    return new Promise((resolve, reject) => {
      if (error === undefined) {
        resolve(response.data)
      } else {
        if (this.config.isError) {
          reject(error)
        }
      }
    })
  }
}
