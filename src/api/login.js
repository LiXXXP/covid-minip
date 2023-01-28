import Request from '../networking/request.js'

//接口列表
export class LoginApi {
  //登录
  miniSignIn = async (params) => {
    const request = new Request({
      url: '/ea/v1/MiniSignIn',
      method: 'post',
      isLoading: true,
      isMessage: true,
      isError: true,
      params: params
    })
    return await request.start()
  }
}
export default new LoginApi()
