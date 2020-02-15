<template>
	<view>
		<view :class="getClass">
			<!-- 状态栏 -->
			<view :style="'height:'+statusBarHeight+'px'"></view>
			<!-- 导航 -->
			<view class="w-100 flex align-center justify-between" v-if="showNav" style="height: 90rpx;">
				<!-- 左边 -->
				<view class="flex align-center">
					<!-- 返回按钮 -->
					<free-icon-button v-if="showBack" @click="back"
					:icon="'\ue645'"></free-icon-button>
					<!-- 标题 -->
					<text v-if="title" class="font-md ml-3">{{getTitle}}</text>
				</view>
				<!-- 右边 -->
				<view class="flex align-center" v-if="showRight">
					<slot name="right">
						<!-- <free-icon-button @click="search" 
						:icon="'\ue607'"></free-icon-button> -->
						<free-icon-button @click="openExtend"
						:icon="'\ue636'"></free-icon-button>
					</slot>
				</view>
			</view>
		</view>
		<!-- 占位 -->
		<view v-if="fixed" :style="fixedStyle"></view>
		
		<!-- 扩展菜单 -->
		<free-popup v-if="showRight" ref="extend" :bodyWidth="320" :bodyHeight="205"
		bodyBgColor="bg-dark" transformOrigin="right top">
			<view class="flex flex-column" 
			style="width: 320rpx;height: 205rpx;">
				<view class="flex-1 flex align-center" 
				v-for="(item,index) in menus"
				:key="index"
				@click="clickEvent(item.event)">
					<text class="iconfont pl-3 pr-2 font-md text-white">{{item.icon}}</text>
					<text class="font-md text-white">{{item.name}}</text>
				</view>
			</view>
		</free-popup>
		
		
	</view>
</template>

<script>
	import freeIconButton from "./free-icon-button.vue"
	import freePopup from "./free-popup.vue"
	var _this;
	export default {
		props: {
			showBack:{
				type:Boolean,
				default:false
			},
			showNav:{
				type:Boolean,
				default:true
			},
			title: {
				type: [String,Boolean],
				default:false 
			},
			fixed:{
				type:Boolean,
				default:true
			},
			noreadnum:{
				type:Number,
				default:0
			},
			bgColor:{
				type:String,
				default:"bg-nav"
			},
			showRight:{
				type:Boolean,
				default:true
			}
		},
		components:{
			freeIconButton,
			freePopup
		},
		data() {
			return {
				statusBarHeight:0,
				navBarHeight:0,
				menus:[
					{
						name:"发起群聊",
						event:"createGroup",
						icon:"\ue600"
					},
					{
						name:"添加关注",
						event:"follow",
						icon:"\ue6a5"
					}
				],
			}
		},
		mounted() {
			_this = this;
			// #ifdef APP-PLUS-NVUE
			this.statusBarHeight = plus.navigator.getStatusbarHeight()
			// #endif
			this.navBarHeight = this.statusBarHeight + uni.upx2px(90)
		},
		computed: {
			fixedStyle() {
				return `height:${this.navBarHeight}px`
			},
			getTitle(){
				let noreadnum = this.noreadnum > 0 ? '('+this.noreadnum+')' : ''
				return this.title
			},
			getClass(){
				let fixed = this.fixed?'fixed-top':''
				return `${fixed} ${this.bgColor}` 
			}
		},
		methods: {
			openExtend() {
				this.$refs.extend.show(uni.upx2px(415),uni.upx2px(150))
			},
			clickEvent(e){
				switch (e){
					case 'createGroup':
						_this.$refs.extend.hide()
						uni.navigateTo({
							url:'/pages/group/addGroup/addGroup'
						})
						break;
					case 'follow':
						_this.$refs.extend.hide()
						uni.navigateTo({
							url:'/pages/friend/addFriend/addFriend'
						})
						break;
				}
			},
			// 返回
			back(){
				uni.navigateBack({
					delta: 1
				});
			}
		},
	}
</script>

<style>
</style>
