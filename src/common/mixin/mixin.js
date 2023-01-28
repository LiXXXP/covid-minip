/*
 * @Author: Jin Biao
 * @Date: 2022-03-09 13:33:02
 * @LastEditTime: 2022-03-23 19:06:23
 * @Description: mimix组合套
 */
export default {
  data() {
    return {
      loadingType: 1, // 0加载前 1加载中 2没有更多
      isLoading: false, // 刷新数据
      loaded: false // 加载完毕
    }
  },
  methods: {
    /**
     * 提示消息msg
     * @param {String} title
     */
    msg(title = '', param = {}) {
      if (!title) return
      uni.showToast({
        title,
        duration: param.duration || 1500,
        mask: param.mask || false,
        icon: param.icon || 'none'
      })
    },
    /**
     * goPage跳转页面
     * @param {String} url
     * @param {Object} options
     * @param {Boolean} options.login 是否检测登录
     */

    goPage(url, login = false, type = 'navigateTo') {
      if (login) {
        if (!uni.getStorageSync('accessToken') || !uni.getStorageSync('userId')) {
          url = '/pages/index/index'
        }
      }
      if (!url) {
        return
      }
      // 跳转类型
      if (type == 'navigateTo') {
        uni.navigateTo({
          url
        })
      }
      if (type == 'redirectTo') {
        uni.redirectTo({
          url
        })
      }
      if (type == 'reLaunch') {
        uni.reLaunch({
          url
        })
      }
      if (type == 'switchTab') {
        uni.switchTab({
          url
        })
      }
    },
    /**
     * 后退
     * @param {String} delta
     */
    goBack(index = 1) {
      console.log('12')
      uni.navigateBack({
        delta: index
      })
    }
  }
}
