import Request from '../networking/request.js'

// 接口列表
export class PolygonsApi {
  // 疫情区
  eidemicAreaDataInquiry = async (params) => {
    const request = new Request({
      url: '/ea/v1/EpidemicAreaDataInquiry',
      method: 'post',
      isLoading: true,
      isMessage: false,
      isError: false,
      params: params
    })
    return await request.start()
  }
}
export default new PolygonsApi()
