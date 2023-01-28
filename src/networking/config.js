const NOOP = () => {}
let baseUrl = ''
if (process.env.NODE_ENV === 'development') {
  // 开发环境
  baseUrl = 'https://test-api-zn.cdgwin.com/api/'
} else if (process.env.NODE_ENV === 'production') {
  // 生产环境
  baseUrl = 'https://api-zn.cdgwin.com/api/'
}

export const flyConfig = {
  baseURL: baseUrl,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    Accept: 'application/json'
  }
}

export const commonConfig = {
  loginCallback: NOOP,
  noPermissionCallback: NOOP,
  businessNoPermissionCallback: NOOP,
  requestUserRoleResCallback: NOOP,
  serverErrorCallback: NOOP
}

export const requestContextConfig = {
  channel: 'mobile',
  entityId: 'gwin',
  locale: '',
  orgId: '',
  privileges: '',
  roles: '',
  serviceId: '',
  userId: ''
}
