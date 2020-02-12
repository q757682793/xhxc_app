<template>
	<view class="login">
		<view class="content">
			<!-- 头部logo -->
			<view class="header">
				<image :src="logoImage"></image>
			</view>
			<!-- 主体表单 -->
			<view class="main">
				<wInput
					v-model="phoneData"
					type="text"
					maxlength="11"
					placeholder="手机号"
				></wInput>
				<wInput
					v-model="passData"
					type="password"
					placeholder="密码"
				></wInput>
			</view>
			<wButton 
				text="登 录"
				:rotate="isRotate" 
				@click.native="startLogin()"
			></wButton>		
			
			<!-- 底部信息 -->
			<view class="footer">
				<navigator url="forget" open-type="navigate">找回密码</navigator>
				<text>|</text>
				<navigator url="register" open-type="navigate">注册账号</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	var _this;
	import wInput from '@/components/watch-login/watch-input.vue' //input
	import wButton from '@/components/watch-login/watch-button.vue' //button
	import JMessage from '@/js_sdk/jmessage-wxapplet-sdk-1.4.2.min.js'
	import getCodeMsg from "@/js_sdk/ErrorCode.js"
	
	import {
		getLogin,
		wexinLogin,
	} from '@/service/api/login.js' //登录api
	
	var JIM = getApp().globalData.JIM;
	var SERVER_API = getApp().globalData.SERVER_API;
	export default {
		data() {
			return {
				//logo图片 base64
				logoImage:'',
				phoneData:'', //用户/电话
				passData:'', //密码
				isRotate: false, //是否加载旋转
				myUsername:""
			};
		},
		onShow(){
			var userLogin = uni.getStorageSync("userLogin");
			this.phoneData = userLogin.phone;
			this.passData = userLogin.password
		},
		components:{
			wInput,
			wButton,
		},
		mounted() {
			_this= this;
		},
		methods: {
			login(username,password){	
				console.log("hh")
				uni.request({
					url:SERVER_API+"appUser/userLogin",
					data:{
						phone:username,
						password:password,
						pushId:plus.push.getClientInfo().clientid
					},
					method:"POST",
					header:{
						token:"token",
					},
					success(res){
						console.log(res)
						if(res.data.code==1){
							let userdata=res.data.result;
							userdata.username=res.data.result.token;
							userdata.password=password;
									
							_this.$store.dispatch("setUserData",userdata); //存入状态
							uni.setStorageSync('setUserData', userdata);
							try {
								if(userdata.photo){
									uni.downloadFile({
										url: userdata.photo,
										success: (res) => {
											if (res.statusCode === 200) {	
												uni.saveFile({
													tempFilePath: res.tempFilePath,
													success: function (res) {
														var savedFilePath = plus.io.convertLocalFileSystemURL(res.savedFilePath);
														userdata.photo=savedFilePath;
														console.log(JSON.stringify(userdata))
														uni.setStorageSync('setUserData', userdata); //存入缓存
													}
												});
											}
										}
									}); 
								}else{
									userdata.photo='/static/images/userpic2.jpg'
									uni.setStorageSync('setUserData',userdata)
								}
							} catch (e) {
								// error
							}
							var userLogin = {
								phone:_this.phoneData,
								password:_this.passData
							}
							uni.setStorageSync("userLogin",userLogin)
							_this.isRotate=false;
							uni.showToast({
								icon: 'success',
								title: '登录成功!'
							});
							uni.switchTab({
								url: '../tabbar/index/index',
							});
						}else{
							uni.showToast({
								"title":"用户名或密码错误",
								"position":"bottom"
							})
							console.log("=======hhh============")
							_this.isRotate=false;
						}
					}
				})				
			},
		    startLogin(){
				//登录
				if(this.isRotate){
					//判断是否加载中，避免重复点击请求
					return false;
				}
				if (this.phoneData == "") {
				     uni.showToast({
				        icon: 'none',
						position: 'bottom',
				        title: '手机号不能为空'
				    });
				    return;
				}
		        if (this.passData=="") {
		            uni.showToast({
		                icon: 'none',
						position: 'bottom',
		                title: '密码不能为空'
		            });
		            return;
		        }
				
				
				_this.isRotate=true
								
				if(JIM.isInit()){
					_this.login(_this.phoneData,_this.passData)
				}else{
					var appkey='09970876f33e884a3624335c';
					var random_str="NkSYvAH3yAw93dqdlto47G9A35xHv4Oa";
					var timestamp=(new Date()).getTime();
					var signature;
					uni.request({
						url: SERVER_API+'appUser/getJMKey',
						header: {
							"token": '1ab5f25e6e44485fb69646158126b6f6',
							"Content-Type":"application/json"
						},
						data:{
							timestamp:timestamp
						},
						success(res) {
							signature = res.data.result;
							JIM.init({
									  "appkey"    : appkey,
									  "random_str": random_str,
									  "signature" : signature,
									  "timestamp" : timestamp,
									  "flag":1
							}).onSuccess(function(data) {
								console.log('Init-success:3333333333333333' + JSON.stringify(data));	
								_this.login(_this.phoneData,_this.passData)
							}).onFail(function(data) {
								uni.showToast({
									"title":getCodeMsg(data.code),
									"position":"bottom"
								})
							});
						}
					})
										
				}			
		    }
		}
	}
</script>

<style>
	@import url("./css/main.css");
</style>
