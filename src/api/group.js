import Request from '../networking/request.js'

//接口列表
export class GroupApi {
  // 创建组织
  miniCreatGroupMaintenance = async (params) => {
    const request = new Request({
      url: '/ea/v1/MiniCreatGroupMaintenance',
      method: 'post',
      isLoading: true,
      isMessage: false,
      isError: false,
      params: params
    })
    return await request.start()
  }
  
  // 组织列表查询
  miniGroupListInquiry = async (params) => {
    const request = new Request({
      url: '/ea/v1/MiniGroupListInquiry',
      method: 'post',
      isLoading: true,
      isMessage: false,
      isError: false,
      params: params
    })
    return await request.start()
  }
  
  // 组织成员列表查询
  miniGroupMemberListInquiry = async (params) => {
    const request = new Request({
      url: '/ea/v1/MiniGroupMemberListInquiry',
      method: 'post',
      isLoading: true,
      isMessage: false,
      isError: false,
      params: params
    })
    return await request.start()
  }
  
  // 加入组织
  miniJoinGroupMaintenance = async (params) => {
    const request = new Request({
      url: '/ea/v1/MiniJoinGroupMaintenance',
      method: 'post',
      isLoading: true,
      isMessage: false,
      isError: false,
      params: params
    })
    return await request.start()
  }
  
  // 默认组织设置
  miniUserDefaultGroupMaintenance = async (params) => {
    const request = new Request({
      url: '/ea/v1/MiniUserDefaultGroupMaintenance',
      method: 'post',
      isLoading: true,
      isMessage: false,
      isError: false,
      params: params
    })
    return await request.start()
  }
}
export default new GroupApi()
