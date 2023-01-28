<template>
  <view class="user">
    <view>
      <u--form
        labelPosition="left"
        :model="model"
        :rules="rules"
        ref="uForm"
        labelWidth="90"
        :labelStyle="{ color: '#3B4664', fontWeight: 500 }"
      >
        <u-form-item label="名称" prop="name" borderBottom>
          <u--input v-model="model.name" border="none"></u--input>
        </u-form-item>
        <u-form-item label="住址" prop="address" borderBottom @click="onChooseLocation">
          <u--input
            disabled
            v-model="model.address"
            disabledColor="#ffffff"
            placeholder="请选择地址"
            border="none"
          ></u--input>
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>
      </u--form>
      <view class="button">
        <view @click="onComplete">完成</view>
      </view>
    </view>
  </view>
</template>

<script>
import UserApi from '@/api/user'
import GroupApi from '@/api/group'

export default {
  data() {
    return {
      groupId: '',
      model: {
        name: '',
        address: ''
      },
      rules: {
        name: {
          type: 'string',
          required: true,
          message: '请填写您的名称',
          trigger: ['blur', 'change']
        },
        address: {
          type: 'string',
          required: true,
          message: '请填写您的地址',
          trigger: ['blur', 'change']
        }
      }
    }
  },
  onLoad(option) {
    this.miniUserInfoInquiry()
    if (option.groupId) {
      this.groupId = option.groupId
    }
  },
  methods: {
    // 个人信息查询
    async miniUserInfoInquiry() {
      const res = await UserApi.miniUserInfoInquiry({
        userId: uni.getStorageSync('userId')
      })
      this.model.name = res.body.realName
      this.model.address = res.body.address
    },
    // 选择地址
    onChooseLocation() {
      const _this = this
      uni.chooseLocation({
        success: function (res) {
          _this.model.address = res.address
          _this.model.lat = res.latitude
          _this.model.lng = res.longitude
        }
      })
    },
    onComplete() {
      const _this = this
      this.$refs.uForm
        .validate()
        .then(async (res) => {
          await UserApi.miniUserInfoMaintenance({
            userId: uni.getStorageSync('userId'),
            address: _this.model.address,
            lat: _this.model.lat,
            lng: _this.model.lng,
            realName: _this.model.name,
            gender: uni.getStorageSync('gender')
          })
          if (_this.groupId) {
            await GroupApi.miniJoinGroupMaintenance({
              groupId: _this.groupId,
              userId: uni.getStorageSync('userId')
            })
            _this.goPage('/pages/index/index?groupId=' + this.groupId, true, 'reLaunch')
          } else {
            _this.goPage('/pages/index/index', true, 'reLaunch')
          }
        })
        .catch((errors) => {
          uni.$u.toast('校验失败')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.user {
  padding: 40rpx;
  .button {
    width: 100%;
    padding: 40rpx 40rpx 60rpx;
    position: fixed;
    bottom: 0;
    left: 0;
    view {
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
