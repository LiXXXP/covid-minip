<template>
	<view class="empty" :class="{'active': show}">
		<image src="../../static/empty/empty.png"></image>
		<text>{{choose[num]}}</text>
	</view>
</template>

<script>
export default {
	props: {
		num:{
			type: Number,
			default: 1
		},
		show: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			choose: {
				1: '很抱歉，未能找到相关内容',
				2: '暂无数据'
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.empty {
	display: flex;
	flex-direction: column;
	align-items: center;
	background: #f8f8f8;
	color: #b1b6bb;
	font-size: 28rpx;
	margin-top: 200rpx;
}
.active {
	background-color:transparent;
	color: #FFFFFF;
}
</style>
