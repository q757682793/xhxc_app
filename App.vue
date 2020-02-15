<script>
	import Vue from 'vue'
	import JMessage from '@/js_sdk/jmessage-wxapplet-sdk-1.4.2.min.js'
	import getCodeMsg from "@/js_sdk/ErrorCode.js"
	import md5 from '@/js_sdk/md5.min.js'
	var JIM = new JMessage({
		debug:true
	})
	export default {
		globalData:{
			JIM:JIM
		},
		onLaunch: function() {
			console.log('App Launch');
			
			// 初始化录音管理器
			this.$store.commit('initRECORD')
			uni.getSystemInfo({
				success: function(e) {
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					};
					// #endif
					
					// #ifdef MP-WEIXIN
					Vue.prototype.StatusBar = e.statusBarHeight;
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif		

				}
			})
		},
		onShow: function() {
			uni.setStorageSync("userData",{
				username:'sudong',
				password:'1234',
				name:'苏栋'
			})
			// uni.setStorageSync("userData",{
			// 	username:'test',
			// 	password:'1234',
			// 	name:'test'
			// })
			console.log('App Show');
			if(!JIM.isInit()){
				uni.showLoading({
					title:"聊天系统初始化"
				})
				var appkey='1216e11bd597960fa1b95a0c';
				var random_str="NkSYvAH3yAw93dqdlto47G9A35xHv4Oa";
				var timestamp=(new Date()).getTime();
				var key = "76b08aedcfa7d7239fdabb01";
				var signature=md5(`appkey=${appkey}&timestamp=${timestamp}&random_str=${random_str}&key=${key}`);

				JIM.init({
						  "appkey"    : appkey,
						  "random_str": random_str,
						  "signature" : signature,
						  "timestamp" : timestamp,
						  "flag":1
				}).onSuccess(function(data) {	
					uni.hideLoading()
					uni.switchTab({
						url:"pages/tabbar/chat/chat"
					})
				}).onFail(function(data) {
					uni.hideLoading()
					uni.showToast({
						"title":getCodeMsg(data.code),
						"position":"bottom"
					})	    
				});
			}
		},
		onHide: function() {
			console.log('App Hide');
		}
	};
</script>

<style>
/*每个页面公共css */ 
	@import "./common/free.css";
	@import "./common/common.css";
	/* #ifndef APP-PLUS-NVUE */
	@import "./common/free-icon.css";
	/* #endif */
</style>
