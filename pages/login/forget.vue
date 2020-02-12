<template>
	<view class="forget margin-top-lg">

		<view class="content">
			<!-- 头部logo -->
			<view class="header">
				<image :src="logoImage"></image>
			</view>
			<!-- 主体 -->
			<view class="main">
				<wInput
					v-model="phoneData"
					type="text"
					maxlength="11"
					placeholder="请输入手机号码"
				></wInput>
				<wInput
					v-model="passData"
					type="password"
					placeholder="请输入新密码"
					isShowPass
				></wInput>
				
				<wInput
					v-model="verCode"
					type="number"
					maxlength="6"
					placeholder="验证码"
					
					isShowCode
					codeText="获取重置码"
					setTime="30"
					ref="runCode"
					@setCode="getVerCode()"
				></wInput>
			</view>
			
			<wButton 
				text="重置密码"
				:rotate="isRotate" 
				@click.native="startRePass()"
			></wButton>

		</view>
	</view>
</template>

<script>
	var _this;
	import wInput from '../../components/watch-login/watch-input.vue' //input
	import wButton from '../../components/watch-login/watch-button.vue' //button
	import Bmob from '@/js_sdk/Bmob-1.7.1.min.js'
	
	var SERVER_API = getApp().globalData.SERVER_API;
	export default {
		data() {
			return {
				logoImage:"",
				phoneData: "", //电话
				passData: "", //密码
				verCode:"", //验证码
				isRotate: false, //是否加载旋转
			}
		},
		onLoad(){
			Bmob.initialize("6c6118d83d45988daab23d65cd5652f3", "9fa3739eae864caea501a9fa1621d437");
		},
		components:{
			wInput,
			wButton
		},
		mounted() {
			_this= this;
		},
		methods: {
			getVerCode(){
				var that = this;
				//获取验证码
				if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(_this.phoneData))) {
				    uni.showToast({
				        icon: 'none',
						position: 'bottom',
				        title: '手机号不正确'
				    });
				    return false;
				}
				Bmob.requestSmsCode({"mobilePhoneNumber": _this.phoneData,"template":"tianci"} ).then(function(obj) {
					uni.showToast({
					    icon: 'none',
						position: 'bottom',
					    title: '验证码已发送'
					});
					that.$refs.runCode.$emit('runCode'); //触发倒计时（一般用于请求成功验证码后调用）
				}, function(err){
					uni.showToast({
					    icon: 'none',
						position: 'bottom',
					    title: err
					});
				});
			},
			startRePass() {
				//重置密码
				if(this.isRotate){
					//判断是否加载中，避免重复点击请求
					return false;
				}
				//获取验证码
				if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(_this.phoneData))) {
				    uni.showToast({
				        icon: 'none',
						position: 'bottom',
				        title: '手机号不正确'
				    });
				    return false;
				}
			    if (this.passData.length < 4) {
			        uni.showToast({
			            icon: 'none',
						position: 'bottom',
			            title: '密码最少4位'
			        });
			        return false;
			    }
				if (this.verCode.length != 6) {
				    uni.showToast({
				        icon: 'none',
						position: 'bottom',
				        title: '请输入6位验证码'
				    });
				    return false;
				}
				
				uni.request({
					url:SERVER_API+"/appUser/changePassword",
					data:{
						phone:_this.phoneData,
						phoneCode:_this.verCode,
						password:_this.passData
					},
					header:{
						"token":"token"
					},
					method:"POST",
					success(res){
						console.log(res)
						if(res.data.code==1){				
							uni.request({
								url:"https://api.im.jpush.cn/v1/users/"+res.data.result+"/password",
								method:"PUT",
								data:{
									"new_password":_this.passData
								},
								header: {
									"Authorization": 'Basic MDk5NzA4NzZmMzNlODg0YTM2MjQzMzVjOmU4ZTg3M2U2MDI0NTMxNWE3MGVkZTRiMg=='
								},
								success(data){
									uni.showToast({
										"title":"密码重置成功",
										"position":"bottom"
									})
									var userLogin = {
										phone:_this.phoneData,
										password:_this.passData
									}
									uni.setStorageSync("userLogin",userLogin)
									uni.navigateTo({
										url:"./login"
									})
								},
								fail(data){
									uni.showToast({
										"title":"密码重置失败",
										"position":"bottom"
									})
								}
							})
							_this.isRotate=false
						}else{
							uni.showToast({
								"title":res.data.message,
								"position":"bottom"
							})
							_this.isRotate=false
						}
					}
				})	
			}
		}
	}
</script>

<style>
	@import url("./css/main.css");
</style>

