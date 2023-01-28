import Request from '../networking/request.js'

// 接口列表
export class UserApi {
  // 查询用户加入组织信息
  miniUserGroupInquiry = async (params) => {
    const request = new Request({
      url: '/ea/v1/MiniUserGroupInquiry',
      method: 'post',
      isLoading: true,
      // isMessage: false,
      isError: false,
      params: params
    })
    return await request.start()
  }

  // 个人信息查询
  miniUserInfoInquiry = async (params) => {
    const request = new Request({
      url: '/ea/v1/MiniUserInfoInquiry',
      method: 'post',
      isLoading: true,
      // isMessage: false,
      isError: false,
      params: params
    })
    return await request.start()
  }

  // 个人信息维护
  miniUserInfoMaintenance = async (params) => {
    const request = new Request({
      url: '/ea/v1/MiniUserInfoMaintenance',
      method: 'post',
      isLoading: true,
      // isMessage: false,
      isError: false,
      params: params
    })
    return await request.start()
  }
}
export default new UserApi()
