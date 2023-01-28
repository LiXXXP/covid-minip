<template>
  <view class="establish">
    <u--form labelPosition="left" :model="model" :rules="rules" ref="uForm" labelWidth="90">
      <u-form-item label="团队名称" prop="name" borderBottom>
        <u--input v-model="model.name" border="none"></u--input>
      </u-form-item>
      <u-form-item label="团队地址" prop="address" borderBottom @click="onChooseLocation">
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
      <view @click="onEstablish">创建并使用</view>
    </view>
  </view>
</template>

<script>
import GroupApi from '@/api/group'
export default {
  data() {
    return {
      model: {
        name: '',
        address: '',
        lat: '',
        lng: ''
      },
      rules: {
        name: {
          type: 'string',
          required: true,
          message: '请填写团队名称',
          trigger: ['blur', 'change']
        },
        address: {
          type: 'string',
          required: true,
          message: '请填写团队地址',
          trigger: ['blur', 'change']
        }
      }
    }
  },
  methods: {
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
    onEstablish() {
      this.$refs.uForm
        .validate()
        .then(async () => {
          const res = await GroupApi.miniCreatGroupMaintenance({
            ...this.model,
            userId: uni.getStorageSync('userId')
          })
          uni.$u.toast('创建成功')
          this.goPage('/pages/index/index?groupId=' + res.body.id, true, 'reLaunch')
        })
        .catch((errors) => {
          uni.$u.toast('校验失败')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.establish {
  padding: 40rpx;
  .button {
    width: 100%;
    padding: 40rpx 40rpx 60rpx;
    background-color: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    view {
      width: 100%;
      color: #fff;
      height: 72rpx;
      font-size: 28rpx;
      text-align: center;
      line-height: 72rpx;
      border-radius: 36rpx;
      background-color: #2ec7c2;
    }
  }
}
</style>
