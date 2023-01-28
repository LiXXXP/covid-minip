<template>
  <view class="member">
    <view class="item" v-for="item in memberList" :key="item.id">
      <view class="flex col-center">
        <img src="@/static/home/user.png" />
        <text class="name">{{ item.realName }}</text>
      </view>
      <view class="flex col-center">
        <img src="@/static/home/address.png" />
        <text class="address">{{ item.address }}</text>
      </view>
    </view>
    <view class="button">
      <button open-type="share">邀请成员</button>
    </view>
  </view>
</template>

<script>
import GroupApi from '@/api/group'
export default {
  data() {
    return {
      groupId: '',
			groupName: '',
      memberList: []
    }
  },
  onLoad(option) {
    if (option.groupId) {
      this.groupId = option.groupId
			this.groupName = option.groupName
      this.miniGroupMemberListInquiry()
    }
  },
  methods: {
    // 成员列表
    async miniGroupMemberListInquiry() {
      const res = await GroupApi.miniGroupMemberListInquiry({
        groupId: this.groupId
      })
      this.memberList = res.body.dataList
    },
    // 小程序分享
    onShareAppMessage(res) {
      return {
        title: `邀请您加入 ${this.groupName} 团队`,
        path: `/pages/join/index?groupId=${this.groupId}&groupName=${this.groupName}`
      }
    },
    // 监听用户点击右上角转发到朋友圈
    onShareTimeline(res) {
      return {
        title: '周边管控'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.member {
  width: 100vw;
  min-height: 100vh;
  padding: 40rpx;
  padding-bottom: 80rpx;
  box-sizing: border-box;
  background-color: #f7faff;
  .item {
    width: 100%;
    color: #1a2234;
    font-size: 28rpx;
    padding: 24rpx;
    margin-bottom: 28rpx;
    border-radius: 16rpx;
    background-color: #fff;
    box-sizing: border-box;
    view {
      margin-bottom: 12rpx;
      img {
        width: 40rpx;
        height: 40rpx;
        margin-right: 8rpx;
      }
      .name {
        color: #3b4664;
        font-size: 28rpx;
        font-weight: 600;
      }
      .address {
        color: #999;
        font-size: 24rpx;
      }
    }
  }
  .button {
    width: 100%;
    padding: 40rpx 40rpx 60rpx;
    position: fixed;
    bottom: 0;
    left: 0;
    button {
      width: 100%;
      color: #fff;
      height: 112rpx;
      font-size: 32rpx;
      font-weight: 500;
      text-align: center;
      line-height: 112rpx;
      border-radius: 56rpx;
      background-color: #2ec7c2;
      box-shadow: 0px 8px 40px 0px rgba(221, 221, 221, 0.8);
    }
  }
}
</style>
