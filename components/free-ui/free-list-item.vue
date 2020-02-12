<template>
	<view class="bg-white flex align-stretch"
	@click="$emit('click')">
		<view class="flex align-center justify-center py-2 pl-3"
		v-if="showLeftIcon" @click.stop="goUserInfo">
			<slot name="icon"></slot>
			<image @click="$emit('imgClick')" class="rounded" :src="cover" v-if="cover"
			mode="aspectFill" :style="coverStyle"></image>
		</view>
		<view class="flex-1 flex align-center justify-between pr-3 py-3 pl-3" @goClick="$emit('goClick')" :class="border ? 'border-bottom' : ''">
			<slot>
				<view v-if="post||company" class="flex flex-column">
					<view class="flex flex-row align-end">
						<text class="font-md text-dark text-ellipsis">{{title}}</text>
						<text class="font-sm text-gray text-ellipsis">&nbsp;&nbsp;{{post=='undefined'?'':post}}</text>
					</view>
					<text class="font-sm text-gray text-ellipsis">{{company=='undefined'?'':company}}</text>
				</view>
				<view v-else>
					<text class="font-md text-dark text-ellipsis" style="width: 530rpx;">{{title}}</text>
				</view>
			</slot>
			<view class="flex align-center" v-if="showRight">
				<slot name="right"></slot>
				<!-- 右箭头 -->
				<text v-if="showRightIcon" class="iconfont text-light-muted font-md">&#xe605;</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			// 是否开启下边线
			border:{
				type:Boolean,
				default:true
			},
			// 封面
			cover: {
				type: String,
				default: ""
			},
			// 封面大小
			coverSize:{
				type: [String,Number],
				default:75
			},
			// 标题
			title:{
				type:String,
				default:""
			},
			// 职位
			post:{
				type:String,
				default:""
			},
			// 公司
			company:{
				type:String,
				default:""
			},
			// 显示右边
			showRight:{
				type:Boolean,
				default:false
			},
			// 显示左边图标
			showLeftIcon:{
				type:Boolean,
				default:true
			},
			// 是否显示箭头
			showRightIcon:{
				type:Boolean,
				default:true
			}
		},
		computed: {
			coverStyle() {
				return `width: ${this.coverSize}rpx;height: ${this.coverSize}rpx;`
			}
		},
	}
</script>

<style>
</style>
