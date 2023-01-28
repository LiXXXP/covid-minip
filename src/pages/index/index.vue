<template>
  <view class="index">
    <view class="top-bar flex row-between">
      <view class="flex">
        <u-button @click="login" v-if="!isLogin">
          <u-avatar :src="userInfo.avatarUrl"></u-avatar>
          <text class="my-company">{{ groupInfo.name }}</text> >
        </u-button>
        <u-button @click="goCompany" v-else>
          <u-avatar :src="userInfo.avatarUrl"></u-avatar>
          <text class="my-company">{{ groupInfo.name }}</text> >
        </u-button>
      </view>
      <u-button @click="login" v-if="!isLogin">
        <text class="number"> {{ groupInfo.number }}</text>
        <text>人</text>
      </u-button>
      <u-button v-else @click="goPage(`/pages/member/index?groupId=${groupInfo.id}&groupName=${groupInfo.name}`)">
        <text class="number"> {{ groupInfo.number }}</text>
        <text>人</text>
      </u-button>
    </view>
    <map
      id="map"
      style="width: 100vw; height: 100vh"
      :scale="scale"
      :latitude="latitude"
      :longitude="longitude"
      :polygons="polygons"
      :markers="mapMarkes"
      @markertap="markerTap"
      @regionchange="onRegionChange"
      subkey="TKWBZ-TIPC3-C543S-Y2NR3-GQMQK-GZF6N"
      layer-style="1"
    ></map>
    <marker-legend></marker-legend>
    <marker-info
      v-if="lastTapMarker !== null && lastTapMarker.id >= 55555"
      :marker="lastTapMarker"
      @onClose="onMarkerInfoClose"
    ></marker-info>
    <u-popup
      :show="showCompany"
      mode="right"
      @close="showCompany = false"
      :customStyle="{ width: '66vw', background: '#F7FAFF', overflow: 'auto' }"
    >
      <view class="user" @click="miniUserGroupInquiry">
        <view class="flex col-center row-between">
          <view class="flex col-center">
            <u-avatar :src="userInfo.avatarUrl" :size="'36'"></u-avatar>
            <view class="realname">{{ userInfo.realName }}</view>
          </view>
          <img src="@/static/home/arrows.png" />
        </view>
        <view class="addr"> {{ userInfo.address }} </view>
      </view>
      <view class="company">
        <view class="team flex col-center">
          <img src="@/static/home/team.png" />
          <text>我的团队</text>
        </view>
        <view
          :class="['item', { active: groupId === item.id }]"
          v-for="item in groupList"
          :key="item.id"
          @click="changeGroup(item)"
          >{{ item.name }}</view
        >
      </view>
      <view class="button">
        <u-button
          type="primary"
          text="创建团队"
          size="large"
          shape="circle"
          color="#2EC7C2"
          @click="goPage('/pages/establish/index')"
        ></u-button>
        <view class="agreement" @click="goPage('/pages/agreement/index')">用户与隐私协议</view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import polygonsApi from '@/api/polygons'
import LoginApi from '@/api/login'
import GroupApi from '@/api/group'
import UserApi from '@/api/user'
import MarkerLegend from './marker-legend.vue'
import MarkerInfo from './marker-info.vue'
export default {
  components: {
    MarkerLegend,
    MarkerInfo
  },
  data() {
    return {
      // 地图相关数据
      mapContext: {},
      scale: 12,
      latitude: 39.909,
      longitude: 116.39742,
      // 地图点和面相关数据
      polygons: [], // 封控区
      polygonsMarkers: [], // 区域marker点
      markers: [], // 成员或组织点
      lastTapMarker: null,
      markerSize: {
        areaSmallWidth: 18,
        areaSmallHeight: 26,
        areaMiddleWidth: 30,
        areaMiddleHeight: 38,
        areaLargeWidth: 50,
        areaLargeHeight: 64,
        peopleSmallWidth: 20,
        peopleSmallHeight: 20,
        peopleMiddleWidth: 28,
        peopleMiddleHeight: 28,
        peopleLargeWidth: 51,
        peopleLargeHeight: 50
      },
      // 用户相关数据
      userInfo: {
        realName: '', // 用户名称
        address: '', // 用户地址
        userId: uni.getStorageSync('userId'),
        nickName: '',
        gender: 0,
        lat: 0,
        lng: 0,
        phone: '',
        avatarUrl: uni.getStorageSync('avatarUrl') // 用户头像
      },
      // 团队相关数据
      groupInfo: {
        id: '', // 企业id
        name: '暂无团队，请创建',
        latitude: 39.909,
        longitude: 116.39742,
        address: '',
        regionCode: '110100',
        number: 0 // 成员个数
      },
      showCompany: false, // 显示团队列表
      groupList: [], // 企业列表
      isLogin: uni.getStorageSync('accessToken') || uni.getStorageSync('userId')
    }
  },
  computed: {
    mapMarkes: function () {
      return this.polygonsMarkers.concat(this.markers)
    }
  },
  onReady() {
    this.mapContext = uni.createMapContext('map', this)
  },
  onShow() {
    // if (option.groupId) {
    //   this.groupInfo.id = option.groupId
    // }
    // 如果已经登录，先查个人信息，个人信息查询后会自己查询管控区域信息
    // 如果没有登录，直接查询管控区域信息，此时默认为北京的管控区域
    if (this.isLogin) {
      this.miniUserInfoInquiry()
    } else {
      this.epidemicAreaDataInquiry()
    }
  },
  methods: {
    // 登陆信息
    login() {
      const _this = this
      uni.login({
        success(res) {
          // 获取用户信息
          uni.showModal({
            title: '获取头像信息',
            content: '更新您的微信头像作为资料',
            success(showModal) {
              if (showModal.confirm) {
                uni.getUserProfile({
                  desc: '用于完善用户资料',
                  success: async function (infoRes) {
                    // console.log(infoRes)
                    const reslut = await LoginApi.miniSignIn({
                      encryptedData: infoRes.encryptedData,
                      iv: infoRes.iv,
                      code: res.code
                    })
                    if (reslut.status.success) {
                      _this.isLogin = true
                      _this.userInfo.avatarUrl = infoRes.userInfo.avatarUrl
                      _this.userInfo.userId = reslut.body.userId
                      _this.userInfo.gender = infoRes.userInfo.gender
                      uni.setStorageSync('userId', reslut.body.userId)
                      uni.setStorageSync('accessToken', reslut.body.accessToken)
                      uni.setStorageSync('gender', infoRes.userInfo.gender)
                      uni.setStorageSync('avatarUrl', infoRes.userInfo.avatarUrl)
                      _this.miniUserInfoInquiry()
                    }
                  },
                  fail: (err) => {
                    console.log(err)
                    _this.miniUserInfoInquiry()
                  }
                })
              } else {
                _this.miniUserInfoInquiry()
              }
            }
          })
        },
        fail(err) {
          console.log('失败： ', err)
        }
      })
    },
    // 打开企业列表
    goCompany() {
      this.showCompany = true
      this.miniGroupListInquiry()
    },
    // 团队列表
    async miniGroupListInquiry() {
      const res = await GroupApi.miniGroupListInquiry({
        userId: this.userInfo.userId
      })
      this.groupList = res.body.dataList
    },
    // 个人信息查询
    async miniUserInfoInquiry() {
      const res = await UserApi.miniUserInfoInquiry({
        userId: this.userInfo.userId
      })
      // 个人信息部分
      this.userInfo = res.body
      this.userInfo.avatarUrl = uni.getStorageSync('avatarUrl')
      // 如果存在团队，查询团队成员
      if (res.body.groupId) {
        // 保存团队信息
        this.groupInfo.id = res.body.groupId
        this.groupInfo.latitude = res.body.groupLat
        this.groupInfo.longitude = res.body.groupLng
        this.groupInfo.name = res.body.groupName
        this.groupInfo.regionCode = res.body.regionCode
        // 修改地图中心点位置，地图移动到团队经纬度
        this.latitude = this.groupInfo.latitude
        this.longitude = this.groupInfo.longitude
        this.mapContext.moveToLocation({
          longitude: this.groupInfo.longitude,
          latitude: this.groupInfo.latitude
        })
        // 查询团队所在市的管控信息和团队成员信息
        this.epidemicAreaDataInquiry()
        this.miniGroupMemberListInquiry()
      }
      if (!this.userInfo.realName || !this.userInfo.address) {
        this.goPage('/pages/user/index')
      }
    },
    // 查询用户加入组织信息
    async miniUserGroupInquiry() {
      if (this.groupInfo.id) {
        const res = await UserApi.miniUserGroupInquiry({
          groupId: this.groupInfo.id,
          userId: this.userInfo.userId
        })
        if (res.body.joinFlag) {
          this.goPage('/pages/user/index')
        } else {
          this.goPage('/pages/join/index?groupId=' + res.body.groupId)
        }
      } else {
        this.goPage('/pages/user/index')
      }
    },
    // 切换企业
    async changeGroup(item) {
      await GroupApi.miniUserDefaultGroupMaintenance({
        groupId: item.id,
        userId: this.userInfo.userId
      })
      this.groupInfo.id = item.id
      this.groupInfo.name = item.name
      this.groupInfo.address = item.address
      this.groupInfo.latitude = item.lat
      this.groupInfo.longitude = item.lng
      this.groupInfo.regionCode = item.regionCode
      this.showCompany = false
      // // 修改地图中心点位置，地图移动到团队经纬度
      this.latitude = this.groupInfo.latitude
      this.longitude = this.groupInfo.longitude
      this.mapContext.moveToLocation({
        longitude: this.groupInfo.longitude,
        latitude: this.groupInfo.latitude
      })
      // this.goPage('/pages/index/index?groupId=' + this.groupId, true, 'reLaunch')
      // 重新查询管控区域信息和组织人员信息
      this.epidemicAreaDataInquiry()
      this.miniGroupMemberListInquiry()
    },
    // 组织成员列表查询
    async miniGroupMemberListInquiry() {
      const res = await GroupApi.miniGroupMemberListInquiry({
        groupId: this.groupInfo.id
      })
      this.groupInfo.number = res.body.dataList.length
      const markers = []
      for (const index in res.body.dataList) {
        const memberInfo = res.body.dataList[index]
        markers.push({
          id: 33333 + parseInt(index),
          latitude: memberInfo.lat,
          longitude: memberInfo.lng,
          label: {
            content: memberInfo.realName,
            textAlign: 'center'
          },
          width: this.markerSize.peopleSmallWidth,
          height: this.markerSize.peopleSmallHeight,
          iconPath:
            memberInfo.gender === 1
              ? '../../static/marker/man.png'
              : memberInfo.gender === 2
                ? '../../static/marker/woman.png'
                : '../../static/marker/neutral.png',
          smallIconPath:
            memberInfo.gender === 1
              ? '../../static/marker/man.png'
              : memberInfo.gender === 2
                ? '../../static/marker/woman.png'
                : '../../static/marker/neutral.png',
          middleIconPath:
            memberInfo.gender === 1
              ? '../../static/marker/man.png'
              : memberInfo.gender === 2
                ? '../../static/marker/woman.png'
                : '../../static/marker/neutral.png',
          largeIconPath:
            memberInfo.gender === 1
              ? '../../static/marker/man-large.png'
              : memberInfo.gender === 2
                ? '../../static/marker/woman-large.png'
                : '../../static/marker/neutral-large.png'
        })
      }
      if (this.groupInfo.id) {
        markers.push({
          id: 20000,
          latitude: this.groupInfo.latitude,
          longitude: this.groupInfo.longitude,
          label: {
            content: this.groupInfo.name,
            textAlign: 'center'
          },
          width: this.markerSize.peopleSmallWidth,
          height: this.markerSize.peopleSmallHeight,
          iconPath: '../../static/marker/team.png',
          smallIconPath: '../../static/marker/team.png',
          middleIconPath: '../../static/marker/team.png',
          largeIconPath: '../../static/marker/team-large.png'
        })
      }
      this.markers = markers
    },
    // 还原上次marker点击样式
    resetLastTapMarker() {
      if (this.lastTapMarker === null) return
      console.log(this.scale)
      if (this.scale >= 13) {
        // 还原到中型图标
        this.lastTapMarker.iconPath = this.lastTapMarker.middleIconPath
        if (this.lastTapMarker.id >= 55555) {
          // 区域
          this.lastTapMarker.width = this.markerSize.areaMiddleWidth
          this.lastTapMarker.height = this.markerSize.areaMiddleHeight
        } else {
          // 人或组织
          this.lastTapMarker.width = this.markerSize.peopleMiddleWidth
          this.lastTapMarker.height = this.markerSize.peopleMiddleHeight
        }
      } else {
        // 还原到小型图标
        this.lastTapMarker.iconPath = this.lastTapMarker.smallIconPath
        if (this.lastTapMarker.id >= 55555) {
          // 区域
          this.lastTapMarker.width = this.markerSize.areaSmallWidth
          this.lastTapMarker.height = this.markerSize.areaSmallHeight
        } else {
          // 人或组织
          this.lastTapMarker.width = this.markerSize.peopleSmallWidth
          this.lastTapMarker.height = this.markerSize.peopleSmallHeight
        }
      }
    },
    // 点击marker
    markerTap(e) {
      this.resetLastTapMarker()
      const marker = this.mapMarkes.find((item) => {
        return item.id === e.markerId
      })
      // 设置为大图标
      marker.iconPath = marker.largeIconPath
      if (marker.id >= 55555) {
        // 区域
        marker.width = this.markerSize.areaLargeWidth
        marker.height = this.markerSize.areaLargeHeight
      } else {
        // 人或组织
        marker.width = this.markerSize.peopleLargeWidth
        marker.height = this.markerSize.peopleLargeHeight
      }
      this.lastTapMarker = marker
    },
    onRegionChange(event) {
      if (event.type === 'end' && event.causedBy === 'scale') {
        this.latitude = event.detail.centerLocation.latitude
        this.longitude = event.detail.centerLocation.longitude
        this.scale = event.detail.scale
        if (this.scale >= 13) {
          // 图标更换为中型
          this.mapMarkes.forEach((item) => {
            item.iconPath = item.middleIconPath
            // 区域的marker
            if (item.id >= 55555) {
              item.width = this.markerSize.areaMiddleWidth
              item.height = this.markerSize.areaMiddleHeight
            } else {
              // 人或组织
              item.width = this.markerSize.peopleMiddleWidth
              item.height = this.markerSize.peopleMiddleHeight
            }
          })
        } else {
          // 图标更换为小型
          this.mapMarkes.forEach((item) => {
            item.iconPath = item.smallIconPath
            if (item.id >= 55555) {
              // 区域
              item.width = this.markerSize.areaSmallWidth
              item.height = this.markerSize.areaSmallHeight
            } else {
              // 人或组织
              item.width = this.markerSize.peopleSmallWidth
              item.height = this.markerSize.peopleSmallHeight
            }
          })
        }
      }
    },
    // 疫情区域查询
    async epidemicAreaDataInquiry() {
      const _this = this
      const res = await polygonsApi.eidemicAreaDataInquiry({
        groupId: this.groupInfo.id,
        userId: this.userInfo.userId,
        regionCode: this.groupInfo.regionCode
      })
      const polygons = []
      const strokeWidth = 1
      const dashArray = [8, 8]
      const polygonsMarkers = []
      for (const index in res.body.areaData) {
        // 生成区域的marker信息
        const areaInfo = res.body.areaData[index]
        const areaMarker = {
          id: 55555 + parseInt(index),
          title: areaInfo.title,
          level: areaInfo.level,
          address: areaInfo.address,
          update: areaInfo.update,
          source: areaInfo.source,
          latitude: areaInfo.locationLat,
          longitude: areaInfo.locationLng,
          width: _this.markerSize.areaSmallWidth,
          height: _this.markerSize.areaSmallHeight
        }
        switch (areaInfo.level) {
          case '封控区':
            areaMarker.iconPath = '../../static/marker/feng-small.png'
            areaMarker.smallIconPath = '../../static/marker/feng-small.png'
            areaMarker.middleIconPath = '../../static/marker/feng-middle.png'
            areaMarker.largeIconPath = '../../static/marker/feng-large.png'
            polygons.push({
              dashArray: dashArray,
              points: [],
              strokeWidth: strokeWidth,
              strokeColor: '#BA0914',
              fillColor: '#BA09144D'
            })
            break
          case '管控区':
            areaMarker.iconPath = '../../static/marker/guan-small.png'
            areaMarker.smallIconPath = '../../static/marker/guan-small.png'
            areaMarker.middleIconPath = '../../static/marker/guan-middle.png'
            areaMarker.largeIconPath = '../../static/marker/guan-large.png'
            polygons.push({
              dashArray: dashArray,
              points: [],
              strokeWidth: strokeWidth,
              strokeColor: '#FF574B',
              fillColor: '#FF574B4D'
            })
            break
          case '中风险场所':
            areaMarker.iconPath = '../../static/marker/zhong-small.png'
            areaMarker.smallIconPath = '../../static/marker/zhong-small.png'
            areaMarker.middleIconPath = '../../static/marker/zhong-middle.png'
            areaMarker.largeIconPath = '../../static/marker/zhong-large.png'
            polygons.push({
              dashArray: dashArray,
              points: [],
              strokeWidth: strokeWidth,
              strokeColor: '#C4A8E0',
              fillColor: '#C4A8E04D'
            })
            break
          case '高风险场所':
            areaMarker.iconPath = '../../static/marker/gao-small.png'
            areaMarker.smallIconPath = '../../static/marker/gao-small.png'
            areaMarker.middleIconPath = '../../static/marker/gao-middle.png'
            areaMarker.largeIconPath = '../../static/marker/gao-large.png'
            polygons.push({
              dashArray: dashArray,
              points: [],
              strokeWidth: strokeWidth,
              strokeColor: '#E087CA',
              fillColor: '#E087CA4D'
            })
            break
          case '防范区':
            areaMarker.iconPath = '../../static/marker/fang-small.png'
            areaMarker.smallIconPath = '../../static/marker/fang-small.png'
            areaMarker.middleIconPath = '../../static/marker/fang-middle.png'
            areaMarker.largeIconPath = '../../static/marker/fang-large.png'
            polygons.push({
              dashArray: dashArray,
              points: [],
              strokeWidth: strokeWidth,
              strokeColor: '#FFC413',
              fillColor: '#FFC4134D'
            })
            break
          default:
            areaMarker.iconPath = '../../static/marker/ti-small.png'
            areaMarker.smallIconPath = '../../static/marker/ti-small.png'
            areaMarker.middleIconPath = '../../static/marker/ti-middle.png'
            areaMarker.largeIconPath = '../../static/marker/ti-large.png'
            polygons.push({
              dashArray: dashArray,
              points: [],
              strokeWidth: strokeWidth,
              strokeColor: '#FF994B',
              fillColor: '#FF994B4D'
            })
            return
        }
        polygonsMarkers.push(areaMarker)
        for (const p of res.body.areaData[index].polygon.split(';')) {
          polygons[index].points.push({ latitude: Number(p.split(',')[0]), longitude: Number(p.split(',')[1]) })
        }
      }
      _this.polygonsMarkers = polygonsMarkers
      _this.polygons = polygons
    },
    onMarkerInfoClose() {
      this.resetLastTapMarker()
      this.lastTapMarker = null
    }
  }
}
</script>

<style lang="scss" scoped>
.index {
  width: 100%;
  height: 100%;
  background-color: #f7faff;
  position: relative;
  .top-bar {
    width: 94%;
    z-index: 999;
    display: flex;
    padding: 14rpx 28rpx;
    border-radius: 16rpx;
    background-color: #fff;
    box-shadow: 0px 16px 40px 0px rgba(144, 152, 150, 0.3);
    position: absolute;
    top: 28rpx;
    left: 50%;
    transform: translate(-50%, 0%);
    ::v-deep .u-avatar {
      margin-right: 16rpx;
    }
    ::v-deep .u-button {
      width: auto;
      border: 0;
      padding: 0;
      border-radius: 0;
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      .my-company {
        color: #3b4664;
        font-size: 32rpx;
        font-weight: 600;
        padding-right: 20rpx;
      }
      .number {
        color: #2ec7c2;
        font-size: 28rpx;
        font-weight: 600;
        padding-right: 20rpx;
      }
    }
  }
  .user {
    color: #606a78;
    font-size: 28rpx;
    padding: 40rpx;
    border-bottom: 2rpx solid rgba(0, 0, 0, 0.1);
    img {
      width: 44rpx;
      height: 44rpx;
    }
    .realname {
      color: #3b4664;
      font-size: 32rpx;
      font-weight: 600;
      padding-left: 16rpx;
    }
    .addr {
      color: #999;
      font-size: 24rpx;
      margin-top: 10rpx;
      margin-left: 80rpx;
      line-height: 34rpx;
    }
  }
  .company {
    min-height: auto;
    padding: 40rpx;
    box-sizing: border-box;
    .team {
      margin-bottom: 32rpx;
      img {
        width: 72rpx;
        height: 72rpx;
        margin-right: 16rpx;
      }
      text {
        color: #1a2234;
        display: block;
        font-weight: 600;
      }
    }
    .item {
      height: 80rpx;
      color: #3b4664;
      font-size: 28rpx;
      line-height: 80rpx;
      text-align: center;
      border-radius: 40rpx;
      margin-bottom: 32rpx;
      box-sizing: border-box;
      background-color: #fff;
      &.active {
        color: #2ec7c2;
        border: 1px solid #2ec7c2;
      }
    }
  }
  .button {
    padding: 0 40rpx;
    ::v-deep .u-button {
      font-family: PingFangSC-Regular, PingFang SC;
    }
    .agreement {
      color: #2ec7c2;
      font-size: 24rpx;
      text-align: right;
      margin-top: 20rpx;
    }
  }
}
</style>
