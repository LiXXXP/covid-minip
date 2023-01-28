/*
 * @Author: Jin Biao
 * @Date: 2022-03-09 13:33:02
 * @LastEditTime: 2022-03-25 17:10:20
 * @Description: util组合套
 */

let _debounceTimeout = null,
  _throttleRunning = false

/**
 * 防抖
 * @param {Function} 执行函数
 * @param {Number} delay 延时ms
 */
export const debounce = (fn, delay = 500) => {
  clearTimeout(_debounceTimeout)
  _debounceTimeout = setTimeout(() => {
    fn()
  }, delay)
}

/**
 * 节流
 * @param {Function} 执行函数
 * @param {Number} delay 延时ms
 */
export const throttle = (fn, delay = 500) => {
  if (_throttleRunning) {
    return
  }
  _throttleRunning = true
  fn()
  setTimeout(() => {
    _throttleRunning = false
  }, delay)
}

// 浏览器判断是否微信
export const isWechat = () => {
  let ua = navigator.userAgent.toLowerCase()
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    //console.log('是微信客户端')
    return true
  } else {
    //console.log('不是微信客户端')
    return false
  }
}

/**
 * 检查登录
 * @return {Boolean}
 */
export const isLogin = (options = {}) => {
  const token = uni.getStorageSync('uniIdToken')
  if (token) {
    return true
  }
  if (options.nav !== false) {
    uni.navigateTo({
      url: '/pages/login/index'
    })
  }
  return false
}

/**
 * 获取页面栈
 * @param {Number} preIndex为1时获取上一页
 * @return {Object}
 */
export const prePage = (preIndex = 1) => {
  const pages = getCurrentPages()
  const prePage = pages[pages.length - (preIndex + 1)]

  return prePage.$vm
}

/**
 * 里程
 * @param {Number} m 米
 * @return {String}
 */
export const distance = (m) => {
  var str = (m / 1000).toFixed(2) + 'km'
  return str
}

/**
 * 耗时 时间戳转换为多久时间段
 * @param {Number} mss 时间戳
 * @return {String}
 */
export const formatDuring = (mss) => {
  var hours = parseInt(mss / (1000 * 60 * 60))
  var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60))
  var seconds = parseInt((mss % (1000 * 60)) / 1000)
  var str = pad(hours) + '.' + pad(minutes) + 'h'
  function pad(s) {
    return s < 10 ? '0' + s : s
  }
  return str
}

/**
 * 格式化时间戳 Y-m-d H:i:s
 * @param {String} format Y-m-d H:i:s
 * @param {Number} timestamp 时间戳
 * @return {String}
 */
export const date = (format, timeStamp) => {
  if ('' + timeStamp.length <= 10) {
    timeStamp = +timeStamp * 1000
  } else {
    timeStamp = +timeStamp
  }
  let _date = new Date(timeStamp),
    Y = _date.getFullYear(),
    m = _date.getMonth() + 1,
    d = _date.getDate(),
    H = _date.getHours(),
    i = _date.getMinutes(),
    s = _date.getSeconds()

  m = m < 10 ? '0' + m : m
  d = d < 10 ? '0' + d : d
  H = H < 10 ? '0' + H : H
  i = i < 10 ? '0' + i : i
  s = s < 10 ? '0' + s : s

  return format.replace(/[YmdHis]/g, (key) => {
    return {
      Y,
      m,
      d,
      H,
      i,
      s
    }[key]
  })
}

export function getDeviceInfo() {
  let deviceInfo = {}
  uni.getSystemInfo({
    success: (res) => {
      deviceInfo = res
    }
  })
  return deviceInfo
}

export function handleTime(time) {
  // time为秒数
  const day = Math.floor(time / 86400) // 天
  const hours = Math.floor((time % 86400) / 3600) // 时
  const minutes = Math.floor((time % 3600) / 60) // 分

  const resultDay = day === 0 ? '' : day + '天'
  const resultHour = day === 0 ? hours + ':' : hours + day * 24 + ':'
  const resultMinute = minutes < 10 ? '0' + minutes : minutes

  return resultHour + resultMinute
}

export function handleAvgSpeed(distance, time) {
  let result = (distance / time) * 3.6
  if(result == 0) {
    return 0.0
  } else {
    return Math.floor(result * 10) / 10
  }
}

// 生成UUID
export function uuid(len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  var uuid = [],
    i
  radix = radix || chars.length

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
  } else {
    // rfc4122, version 4 form
    var r

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16)
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return uuid.join('')
}

export function getRadomNumber(randomLength) {
  let result = Math.random().toString().substr(2, randomLength) + Date.now().toString().substr(10, 3)
  return Number(result)
}
