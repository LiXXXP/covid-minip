<template>
  <view class="join flex flex-column row-between">
    <view class="title">
      <view class="company">
        <text>{{ myCompany }}</text> 团队
      </view>
      <view class="text flex col-center">
        <img src="@/static/home/flower.png" />
        <text>邀请您加入！</text>
      </view>
    </view>
    <img class="img" src="@/static/home/join.png" />
    <view class="btns flex row-between">
      <u-button @click="onNotJoin">暂不加入</u-button>
      <u-button @click="login" v-if="!isLogin"> 立即加入 </u-button>
      <u-button v-else @click="onJoin">立即加入</u-button>
    </view>
  </view>
</template>

<script>
import LoginApi from '@/api/login'
import UserApi from '@/api/user'
import GroupApi from '@/api/group'
export default {
  data() {
    return {
      groupId: '',
      myCompany: '',
      userId: uni.getStorageSync('userId'),
      isLogin: uni.getStorageSync('accessToken') || uni.getStorageSync('userId')
    }
  },
  onLoad(option) {
    if (option.groupId) {
      this.groupId = option.groupId
      this.myCompany = option.groupName
    }
    if (this.isLogin) {
      this.miniUserGroupInquiry()
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
                      _this.userId = reslut.body.userId
                      uni.setStorageSync('userId', reslut.body.userId)
                      uni.setStorageSync('accessToken', reslut.body.accessToken)
                      uni.setStorageSync('gender', infoRes.userInfo.gender)
                      uni.setStorageSync('avatarUrl', infoRes.userInfo.avatarUrl)
                      _this.miniUserGroupInquiry()
                    }
                  },
                  fail: (err) => {
                    console.log(err)
                    _this.miniUserGroupInquiry()
                  }
                })
              } else {
                _this.miniUserGroupInquiry()
              }
            }
          })
        },
        fail(err) {
          console.log('失败： ', err)
        }
      })
    },
    // 查询用户加入组织信息
    async miniUserGroupInquiry() {
      const res = await UserApi.miniUserGroupInquiry({
        groupId: this.groupId,
        userId: uni.getStorageSync('userId')
      })
      if (res.body.joinFlag) {
        this.cutGrounp(res.body.groupId)
        return
      }
      this.myCompany = res.body.name
      this.miniUserInfoInquiry()
    },
    // 个人信息查询
    async miniUserInfoInquiry() {
      const res = await UserApi.miniUserInfoInquiry({
        userId: uni.getStorageSync('userId')
      })
      if (!res.body.realName || !res.body.address) {
        this.goPage('/pages/user/index?groupId=' + this.groupId)
      } else {
        this.onJoin()
      }
    },
    // 切换企业
    async cutGrounp(id) {
      await GroupApi.miniUserDefaultGroupMaintenance({
        groupId: id,
        userId: uni.getStorageSync('userId')
      })
      this.goPage('/pages/index/index?groupId=' + id, true, 'reLaunch')
    },
    // 加入
    async onJoin() {
      const res = await GroupApi.miniJoinGroupMaintenance({
        groupId: this.groupId,
        userId: this.userId
      })
      this.goPage('/pages/index/index?groupId=' + this.groupId, true, 'reLaunch')
    },
    // 不加入
    onNotJoin() {
      this.goPage('/pages/index/index', true, 'reLaunch')
    }
  }
}
</script>

<style lang="scss" scoped>
.join {
  width: 100vw;
  height: 100vh;
  padding: 200rpx 40rpx;
  box-sizing: border-box;
  background-color: #f7faff;
  .title {
    color: #000;
    font-size: 32rpx;
    .company {
      text {
        font-size: 56rpx;
        font-weight: 600;
        margin-right: 10rpx;
      }
    }
    .text {
      color: #606a78;
      font-size: 32rpx;
      margin-top: 15rpx;
      img {
        width: 52rpx;
        height: 52rpx;
        margin-right: 8rpx;
      }
    }
  }
  .img {
    width: 222rpx;
    height: 200rpx;
    margin: 0 auto;
  }
  .btns {
    ::v-deep .u-button {
      border: 0;
      padding: 0;
      width: 45%;
      color: #3b4664;
      height: 112rpx;
      font-size: 32rpx;
      font-weight: 500;
      text-align: center;
      line-height: 112rpx;
      border-radius: 56rpx;
      box-sizing: border-box;
      background-color: #fff;
      border: 2px solid #eceffa;
      font-family: PingFangSC-Regular, PingFang SC;
      &:last-child {
        width: 50%;
        color: #fff;
        background-color: #2ec7c2;
      }
    }
  }
}
</style>
