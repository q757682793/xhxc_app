<template>
	<view :class="istop ? 'bg-light' : 'bg-white'" >
	<div class="flex align-stretch" @tap="onClick"  @longpress="long">
		<view class="flex align-center justify-center position-relative"
		style="width: 145rpx;">
			<free-avater :src="item.avatar?item.avatar: '/static/images/userpic.jpg'" size="92"></free-avater>
			<free-badge badgeStyle="top:15rpx;right:15rpx"
			v-if="item.unread_msg_count" :value="item.unread_msg_count"></free-badge>
		</view>
		<view class="flex flex-column border-bottom flex-1 py-3 pr-3 border-light-secondary">
			<view class="flex align-center justify-between mb-1">
				<text class="font-md flex-4 text-ellipsis">{{item.nickName?item.nickName:item.name}}</text>
				<text class="flex-2 font-sm text-light-muted text-right">{{item.mtime|formatTime}}</text>
			</view>
			<text class="font text-ellipsis text-light-muted">{{item.extras.latest_msg}}</text>
		</view>
	</div>
	</view>
</template>

<script>
	import freeBase from "@/common/mixin/free-base.js"
	
	import freeAvater from "@/components/free-ui/free-avater.vue"
	import freeBadge from "@/components/free-ui/free-badge.vue"
	
	var _this;
	export default {
		mixins:[freeBase],
		components: {
			freeAvater,
			freeBadge
		},
		data() {
			return {
				myToken: uni.getStorageSync("userData").username
			}
		},
		computed:{
			istop(){
				return uni.getStorageSync("isTop"+this.myToken+this.item.username)||false					
			}
		},
		props: {
			item: Object,
			index:Number
		},
		methods:{
			onClick(e){				
				var username = this.item.username;
				var nickname = this.item.nickName;
				var avatar = this.item.avatar;
				uni.navigateTo({
					url: `/pages/chat/chat?username=${username}&nickname=${nickname}&avatar=${avatar}`,
				});
				
			},
			long(e){
				let x = 0
				let y = 0
				// #ifdef APP-PLUS-NVUE
				if (Array.isArray(e.changedTouches) && e.changedTouches.length > 0) {
					x = e.changedTouches[0].screenX
					y = e.changedTouches[0].screenY
				}
				// #endif
				// #ifdef MP
				x = e.detail.x
				y = e.detail.y
				// #endif
				this.$emit('long',{
					x,
					y,
					index:this.index
				})
			}
		}
	}
</script>

<style>
</style>
