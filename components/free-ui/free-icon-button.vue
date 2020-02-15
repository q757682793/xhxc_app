<template>
	<view class="flex align-center justify-center" 
 @click="$emit('click')"
	style="height: 90rpx;width: 90rpx;">
		<text class="iconfont font-lg" :class="iconClass">{{icon}}</text>
	</view>
</template>

<script>
	export default {
		props: {
			icon: {
				type: String,
				default: ''
			},
			iconClass: {
				type: String,
				default: ''
			},
		}
	}
</script>

<style>
</style>
