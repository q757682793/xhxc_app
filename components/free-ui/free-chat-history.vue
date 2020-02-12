<template>
	<view>
		<div class="flex align-stretch" @tap="onClick">
			<view class="flex align-center justify-center position-relative"
			style="width: 145rpx;">
				<free-avater :src="getAvatar" size="92"></free-avater>
			</view>
			<view class="flex flex-column border-bottom flex-1 py-3 pr-3 border-light-secondary">
				<view class="flex align-center justify-between mb-1">
					<text class="font-md flex-4 text-ellipsis">{{item.from_name}}</text>
					<text class="flex-2 font-sm text-light-muted text-right">{{item.create_time|formatTime}}</text>
				</view>
				<text class="font text-ellipsis text-light-muted">{{item.msg_body.text}}</text>
			</view>
		</div>
	</view>
</template>

<script>
	import freeBase from "@/common/mixin/free-base.js"
	import freeAvater from "@/components/free-ui/free-avater.vue"
	var SERVER_API = getApp().globalData.SERVER_API;
	export default {
		mixins:[freeBase],
		data() {
			return {
				
			}
		},
		props: {
			item: Object
		},
		components:{
			freeAvater
		},
		computed:{
			getAvatar(){//获取头像
				var tokenList=[];
				var token = this.item.from_id
				tokenList.push(token);
				var avatar = uni.getStorageSync("avatar"+token)
			
				if(avatar){
					return avatar
				}else{
					uni.request({
						url:SERVER_API+'appUser/getUserPhotoByToken',
						data:tokenList,
						header:{
							token:uni.getStorageSync("setUserData").token
						},
						method:"POST",
						success(res){
							var resAvatar = res.data.result[token]
							if(resAvatar==""){
								uni.setStorageSync("avatar"+token,"/static/images/userpic2.jpg")
								return "/static/images/userpic2.jpg"
							}else{
								uni.downloadFile({
									url: resAvatar,
									success: (res) => {
										if (res.statusCode === 200) {	
											uni.saveFile({
												tempFilePath: res.tempFilePath,
												success: function (res) {
													var savedFilePath = plus.io.convertLocalFileSystemURL(res.savedFilePath);
													uni.setStorageSync("avatar"+token,savedFilePath)			
													return savedFilePath
												}
											});
										}
									}
								}); 
							}						
						}
					})
				}
			}
		},
		methods: {
			onClick(){
				uni.hideKeyboard()
				var myUsername = uni.getStorageSync("setUserData").username;
				if(this.item.target_type=="single"){
					console.log(this.item)
					console.log(myUsername)
					if(this.item.from_id==myUsername){
						var nickname = this.item.target_name
						var username = this.item.target_id
					}else{
						var nickname = this.item.from_name
						var username = this.item.from_id
					}
					var index = this.item.index
					uni.navigateTo({
						url:`/pages/chat/chat/chat?username=${username}&nickname=${nickname}&index=${index}`
					})
				}else if(this.item.target_type=="group"){
					var gid= this.item.target_id
					var gname = this.item.target_name
					var index=this.item.index
					uni.navigateTo({
						url: '/pages/group/groupChat/groupChat?gid='+gid+'&gname='+gname+'&index='+index,
					});
				}
				
			}
		}
	}
</script>

<style>

</style>
