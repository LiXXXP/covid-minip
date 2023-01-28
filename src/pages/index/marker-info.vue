<template>
  <view class="marker-info">
    <view class="marker-info_top">
      <view class="marker-info_title">{{ marker.title }}</view>
      <view @click="onClose">
        <u-icon name="close" color="#1A2234" size="22"></u-icon>
      </view>
    </view>
    <view class="marker-info_address">{{ marker.address }}</view>
    <view class="marker-info_bottom">
      <view class="marker-info_date">{{ marker.update }}</view>
      <view class="marker-info_level">{{ marker.level }}</view>
    </view>
    <view v-if="marker.source" class="marker-info_source">{{ marker.source }}</view>
  </view>
</template>

<script>
export default {
  props: {
    marker: {
      type: Object,
      require: true
    }
  },
  methods: {
    onClose() {
      this.$emit('onClose')
    }
  }
}
</script>

<style lang="scss" scoped>
.marker-info {
  position: fixed;
  bottom: 68rpx;
  left: 32rpx;
  right: 32rpx;
  border-radius: 20rpx;
  background-color: rgba(255, 255, 255);
  z-index: 1003;
  padding: 32rpx;
  .marker-info_top {
    display: flex;
    .marker-info_title {
      font-size: 32rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #1a2234;
      line-height: 44rpx;
      flex: 1;
    }
  }
  .marker-info_address {
    margin-top: 12rpx;
    height: 32rpx;
    font-size: 24rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #606a78;
    line-height: 32rpx;
  }
  .marker-info_bottom {
    margin-top: 36rpx;
    display: flex;
    .marker-info_date {
      height: 44prx;
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 44rpx;
    }
    .marker-info_level {
      margin-left: 12rpx;
      height: 44rpx;
      border-radius: 8rpx;
      border: 2rpx solid #dd3636;
      padding: 0 12rpx;
      font-size: 22rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #dd3636;
      text-align: center;
      line-height: 44rpx;
    }
  }
  .marker-info_source {
    margin-top: 12rpx;
    height: 32rpx;
    font-size: 24rpx;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #1a2234;
    line-height: 32rpx;
  }
}
</style>
