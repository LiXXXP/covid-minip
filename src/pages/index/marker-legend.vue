<template>
  <view class="marker-legend">
    <view class="marker-legend_list">
      <view class="marker-legend_item">
        <view class="marker-legend_thumbnail" style="background: rgb(196, 168, 224)"></view>
        <view class="marker-legend_text">中风险</view>
      </view>
      <view class="marker-legend_item">
        <view class="marker-legend_thumbnail" style="background: rgb(225, 135, 202)"></view>
        <view class="marker-legend_text">高风险</view>
      </view>
      <view class="marker-legend_item">
        <view class="marker-legend_thumbnail" style="background: rgb(250, 187, 62)"></view>
        <view class="marker-legend_text">防范区</view>
      </view>
      <view class="marker-legend_item">
        <view class="marker-legend_thumbnail" style="background: rgb(255, 128, 64)"></view>
        <view class="marker-legend_text">提级管理区</view>
      </view>
      <view class="marker-legend_item">
        <view class="marker-legend_thumbnail" style="background: rgb(240, 60, 60)"></view>
        <view class="marker-legend_text">管控区</view>
      </view>
      <view class="marker-legend_item">
        <view class="marker-legend_thumbnail" style="background: rgb(181, 31, 0)"></view>
        <view class="marker-legend_text">封控区</view>
      </view>
    </view>
  </view>
</template>

<script></script>

<style lang="scss" scoped>
.marker-legend {
  position: fixed;
  top: 148rpx;
  right: 24rpx;
  border-radius: 16rpx;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1002;
  .marker-legend_list {
    padding: 12rpx 24rpx;
    .marker-legend_item {
      position: relative;
      padding-left: 32rpx;
      .marker-legend_thumbnail {
        position: absolute;
        top: 16rpx;
        left: 0;
        width: 16rpx;
        height: 16rpx;
        border-radius: 8rpx;
      }
      .marker-legend_text {
        font-size: 28rpx;
        line-height: 52rpx !important;
      }
    }
  }
}
</style>
