<template>
	<div @longpress="long">
		<!-- 时间显示 -->
		<view v-if="showTime" 
		class="flex align-center justify-center pb-4 pt-2">
			<text class="font-sm text-light-muted">{{showTime}}</text>
		</view>
		<!-- 撤回消息 -->
		<view v-if="item.msg_body.extras.isremove" ref="isremove"
		class="flex align-center justify-center pb-4 pt-1 chat-animate">
			<text class="font-sm text-light-muted">你撤回了一条信息</text>
		</view>
		<!-- 气泡 -->
		<view v-else class="flex align-start position-relative mb-3"
		:class="isother ? 'justify-start' : 'justify-end'">
			<!-- 好友 -->
			<template v-if="isother">
				<free-avater size="70" :src="getAvatar"
				clickType="navigate" :token="item.from_id"></free-avater>
				
				<text v-if="hasLabelClass" class="iconfont text-white font-md position-absolute chat-left-icon">&#xe601;</text>
			</template>
			
			<!-- 个人名片 -->
			<div v-if="item.msg_body.msg_type=='card'" class=" rounded" :class="isother ? 'p-2 bg-white ml-3' : 'p-2 bg-white mr-3'" style="width:400rpx;" >
				<view class="flex align-center" @click="openUser">
					<image :src="item.msg_body.cardAvatar"
					style="width: 100rpx;height: 100rpx;" 
					class="mx-1"></image>
					<view class="flex flex-column flex-3">
						<text class="font-md text-ellipsis flex-1">{{item.msg_body.cardName}}</text>
						<text class="font-sm text-gray flex-1 flex-wrap" >个人名片</text>
					</view>
				</view>
			</div>
			
			<!-- 位置 -->
			<div v-else-if="item.msg_type=='location'" class=" rounded" :class="isother ? 'p-2 bg-white ml-3' : 'p-2 bg-white mr-3'" style="max-width:500rpx;" >
				<view class="flex align-center" @click="openLocation">
					<image src="/static/images/map.png"
					style="width: 80rpx;height: 80rpx;" 
					class="mx-1"></image>
					<view class="flex flex-column flex-3">
						<text class="font-md text-ellipsis flex-1">{{item.msg_body.extras.title}}</text>
						<text class="font-sm text-gray flex-1 flex-wrap" >{{item.msg_body.label}}</text>
					</view>
				</view>
			</div>
						
			<div v-else class=" rounded" :class="labelClass" style="max-width:500rpx;" :style="labelStyle">
				<!-- 表情包  -->
				<free-image v-if="item.msg_body.extras.isEmotion" :src="item.msg_body.extras.emotion" @click="preview(item.msg_body.extras.emotion)" imageClass="rounded" :maxWidth="500" :maxHeight="350"></free-image>

				<!-- 文字 -->
				
				<text v-else-if="item.msg_type === 'text'" class="font-md">{{item.msg_body.text}}</text>
				<!--  图片-->							
				<free-image  v-else-if="item.msg_type === 'image'" :src="item.msg_body.media_id" @click="preview(item.msg_body.media_id)" imageClass="rounded" :maxWidth="500" :maxHeight="350"></free-image>

				<!-- 音频 -->
				<view v-else-if="item.msg_body.extras.isAudio" 
				class="flex align-center"
				@click="openAudio">
					<image v-if="!isother" :src=" !audioPlaying ? '/static/audio/audio3.png' : '/static/audio/play.gif'" 
					style="width: 50rpx;height: 50rpx;" 
					class="mx-1"></image>
					<text class="font">{{item.msg_body.extras.time + '"'}}</text>
					<image v-if="isother" :src=" !audioPlaying ? '/static/audio/audio3.png' : '/static/audio/play.gif'"
					style="width: 50rpx;height: 50rpx;" 
					class="mx-1"></image>
				</view>
				
				<!-- 视频 -->
				<view v-else-if="item.msg_body.extras.isVideo"
				class="position-relative rounded"
				@click="openVideo">
					<free-image :src="item.msg_body.extras.poster" imageClass="rounded" :maxWidth="300" :maxHeight="350" @load="loadPoster"></free-image>
					<text class="iconfont text-white position-absolute" style="font-size: 80rpx;width: 80rpx;height: 80rpx;" :style="posterIconStyle">&#xe61d;</text>
				</view>		
				
			</div>
			
			
			
			<!-- 本人 -->
			<template v-if="!isother&&item.msg_type!='location'&&item.msg_body.msg_type!='card'">
				<text v-if="hasLabelClass" class="iconfont text-chat-item font-md position-absolute chat-right-icon">&#xe619;</text>
				<free-avater size="70" :token="item.from_id" :src="myAvatar||'/static/images/userpic2.jpg'"
				clickType="navigate"></free-avater>
			</template>
			
			<!-- 本人 位置-->
			<template v-if="!isother&&item.msg_type=='location'">
				<text v-if="hasLabelClass" class="iconfont text-white font-md position-absolute chat-right-icon">&#xe619;</text>
				<free-avater size="70" :token="item.from_id" :src="myAvatar||'/static/images/userpic2.jpg'"
				clickType="navigate"></free-avater>
			</template>
			
			<!-- 本人 名片-->
			<template v-if="!isother&&item.msg_body.msg_type=='card'">
				<text v-if="hasLabelClass" class="iconfont text-white font-md position-absolute chat-right-icon">&#xe619;</text>
				<free-avater size="70" :token="item.from_id" :src="myAvatar||'/static/images/userpic2.jpg'"
				clickType="navigate"></free-avater>
			</template>
			
			
		</view>
		
	</div>
</template>

<script>
	import freeAvater from "@/components/free-ui/free-avater.vue"
	import freeImage from './free-image.vue';
	import $T from "@/common/free-lib/time.js"
	
	import { mapState,mapActions } from 'vuex'
	
	var JIM = getApp().globalData.JIM;
	var SERVER_API = getApp().globalData.SERVER_API
	var _this;
	export default {
		components: {
			freeAvater,
			freeImage
		},
		props: {
			item: Object,
			index:Number,
			// 上一条消息的时间戳
			pretime:[Number,String],
			avatar:String,
			myAvatar:String,
			myUsername:String
		},
		data() {
			return {
				innerAudioContext:null,
				audioPlaying:false,
				// 默认封面的宽高
				poster:{
					w:100,
					h:100
				},
				
			}
		},
		computed: {
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
			},
			// 是否是他人
			isother() {
				// 获取他人id
				return this.item.from_id !== this.myUsername
			},
			// 显示的时间
			showTime(){
				return $T.getChatTime(this.item.create_time,this.pretime)
			},
			// 是否需要气泡样式
			hasLabelClass(){
				if(this.item.msg_body.extras.isEmotion||this.item.msg_type=="image"||this.item.msg_body.extras.isVideo){
					return false;
				}else{
					return true;
				}
			}, 
			// 气泡的样式
			labelClass(){
				if(this.hasLabelClass){
					return this.isother ? 'p-2 bg-white ml-3' : 'p-2 bg-chat-item mr-3';
				}else{
					return this.isother ? 'ml-3' : 'mr-3';
				}
			},
			labelStyle(){
				if (this.item.msg_body.extras.isAudio) {
					let time = this.item.msg_body.extras.time || 0
					let width = parseInt(time) / (60/500)
					width = width < 150 ? 150 : width
					return `width:${width}rpx;`
				}
			},
			// 短视频封面图标位置
			posterIconStyle(){
				let w = this.poster.w/2 - uni.upx2px(80)/2
				let h = this.poster.h/2- uni.upx2px(80)/2
				return `left:${w}px;top:${h}px;`
			},
			
		},
		mounted() {
			// 注册全局事件

			if (this.item.msg_body.extras.isAudio) {
				this.audioOn(this.onPlayAudio)
			}
			// 监听是否撤回消息
			// #ifdef APP-PLUS-NVUE
			this.$watch('item.msg_body.extras.isremove',(newVal,oldVal)=>{
				if (newVal) {
					const animation = weex.requireModule('animation')
					this.$nextTick(()=>{
						animation.transition(this.$refs.isremove, {
						    styles: {
								opacity:1
						    },
						    duration: 100, //ms
						    timingFunction: 'ease',
						    }, function () {
						       // console.log('动画执行结束');
						    })
					})
				}
			})
			// #endif
		},
		// 组件销毁
		destroyed() {

			if (this.item.msg_body.extras.isAudio) {
				this.audioOff(this.onPlayAudio)
			}
			// 销毁音频
			if (this.innerAudioContext) {
				this.innerAudioContext.destroy()
				this.innerAudioContext = null
			}
		},
		methods:{
			...mapActions(['audioOn','audioEmit','audioOff']),
			// 加载封面
			loadPoster(e){
				this.poster.w = e.w
				this.poster.h = e.h
			},
			// 监听播放音频全局事件
			onPlayAudio(index){
				if (this.innerAudioContext) {
					if (this.index !== index) {
						this.innerAudioContext.pause()
					}
				}
			},
			// 播放音频
			openAudio(){
				// 通知停止其他音频
				this.audioEmit(this.index)
				if (!this.innerAudioContext) {
					this.innerAudioContext = uni.createInnerAudioContext();
					this.innerAudioContext.src =  plus.io.convertAbsoluteFileSystem(this.item.msg_body.media_id);
					this.innerAudioContext.play()
					// 监听播放
					this.innerAudioContext.onPlay(()=>{
						this.audioPlaying = true
					})
					// 监听暂停
					this.innerAudioContext.onPause(()=>{
						this.audioPlaying = false
					})
					// 监听停止
					this.innerAudioContext.onStop(()=>{
						this.audioPlaying = false
					})
					// 监听错误
					this.innerAudioContext.onError(()=>{
						this.audioPlaying = false
					})
				} else {
					this.innerAudioContext.stop()
					this.innerAudioContext.play()
				}
			},
			// 预览图片
			preview(url){
				if(this.item.msg_body.extras.isEmotion){
					this.$emit('preview',this.item.msg_body.extras.emotion)
				}else{
					this.$emit('preview',url)
				}
			},
			// 长按事件
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
			},
			// 打开视频
			openVideo(){
				var my='false';
				if(this.item.my){
					my='true';
				}
				uni.navigateTo({
					url: '/pages/chat/video/video?url='+this.item.msg_body.media_id+'&my='+my,
				});
			},
			openLocation(){
				_this = this;
				uni.openLocation({
					'latitude':_this.item.msg_body.latitude,
					'longitude':_this.item.msg_body.longitude,
					'scale':_this.item.msg_body.scale,
					'name':_this.item.msg_body.extras.title,
					'address':_this.item.msg_body.label,
					success: function () {
						// console.log('success');
					}
				})
			},
			openUser(){
				_this = this;
				uni.navigateTo({
					url:"/pages/mail/user-base/user-base?token="+_this.item.msg_body.cardToken
				})
			}
		}
	}
</script>

<style scoped>
	.chat-left-icon{
		left: 80rpx;top: 20rpx;
	}
	.chat-right-icon{
		right: 80rpx;
		top: 20rpx;
	}
	.chat-animate{
		/* #ifndef APP-PLUS-NVUE */
		opacity: 0;
		/* #endif */
	}
</style>
