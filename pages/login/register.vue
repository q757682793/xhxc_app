<template>
	<view class="register">
	
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
					placeholder="手机号"
				></wInput>
				<wInput
					v-model="verCode"
					type="number"
					maxlength="6"
					placeholder="验证码"
					
					isShowCode
					ref="runCode"
					@setCode="getVerCode()"
				></wInput>	
				<wInput
					v-model="passData"
					type="password"
					placeholder="登录密码"
					isShowPass
				></wInput>
				<view class="flex flex-row">
					<wInput
							v-model="name"
							type="text"
							placeholder="姓名"
						></wInput>
					<view class="flex-sub mt-4 ml-3">
						<switch class="switch-sex" @change="SwitchSex" :class="skin?'checked':''" :checked="skin?true:false"></switch>
					</view>
				</view>
				<wInput
					v-model="inviter"
					type="text"
					placeholder="邀请人(选填)"
					isShowPass
				></wInput>
				
				
				
			</view>
				
			<wButton 
				text="注 册"
				:rotate="isRotate" 
				@click.native="startReg()"
			></wButton>
			
			<!-- 底部信息 -->
			<view class="footer">
				<text 
					@tap="isShowAgree" 
					class="cuIcon"
					:class="showAgree?'cuIcon-radiobox':'cuIcon-round'"
				>同意</text>
				<!-- 协议地址 -->
				<text @click="goAgreement">《协议》</text>
			</view>
		</view>
	</view>
</template>

<script>
	var _this;
	import wInput from '@/components/watch-login/watch-input.vue' //input
	import wButton from '@/components/watch-login/watch-button.vue' //button
	import Bmob from '@/js_sdk/Bmob-1.7.1.min.js'
	import getCodeMsg from "@/js_sdk/ErrorCode.js"
	
	var JIM = getApp().globalData.JIM;
	var SERVER_API = getApp().globalData.SERVER_API;
	export default {
		data() {
			return {
				//logo图片 base64
				logoImage:'',
				phoneData:'', // 用户/电话
				passData:'', //密码
				verCode:"", //验证码
				name:"",//姓名
				showAgree:true, //协议是否选择
				isRotate: false, //是否加载旋转
				skin: false,//女
				inviter:"",//邀请人
			}
		},
		components:{
			wInput,
			wButton,
		},
		mounted() {
			_this= this;
		},
		onLoad(){
			Bmob.initialize("6c6118d83d45988daab23d65cd5652f3", "9fa3739eae864caea501a9fa1621d437");	
		},
		methods: {
			goAgreement(){
				uni.navigateTo({
					url: '../webview/webview?url=http://117.83.152.39:8081/agreement/index.html',
				});
			},
			SwitchSex(e) {
				this.skin = e.detail.value
			},
			isShowAgree(){
				//是否选择协议
				_this.showAgree = !_this.showAgree;
			},
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
		    startReg() {
				//注册
				if(this.isRotate){
					//判断是否加载中，避免重复点击请求
					return false;
				}
				if (this.showAgree == false) {
				    uni.showToast({
				        icon: 'none',
						position: 'bottom',
				        title: '请先同意《协议》'
				    });
				    return false;
				}
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
				if(this.name==''){
					uni.showToast({
					    icon: 'none',
						position: 'bottom',
					    title: '请输入姓名'
					});
					return false;
				}
				
				_this.isRotate=true
				
				uni.request({
					url:SERVER_API+"appUser/userReg",
					data:{
						"phone":_this.phoneData,
						"name":_this.name,
						"phoneCode":_this.verCode,
						"password":_this.passData,
						sex:_this.skin?'1':'2',
						inviter:_this.inviter
					},
					header:{
						"token":"token"
					},
					method:"POST",
					success(res){
						console.log(res)
						if(res.data.code==1){
							JIM.register({
							    'username' : res.data.result,
								'password': _this.passData,
								'nickname' : _this.name,
								"gender":_this.skin?'1':'2'
							}).onSuccess(function(data) {
							    console.log('success:' + JSON.stringify(data));		
								uni.showToast({
									icon: 'success',
									position: 'bottom',
									title: '注册成功！'
								});
								_this.isRotate=false;
								var userLogin = {
									phone:_this.phoneData,
									password:_this.passData
								}
								uni.setStorageSync("userLogin",userLogin)
								uni.navigateTo({
									url:"./login"
								})
							}).onFail(function(data) {
									console.log('error:' + JSON.stringify(data))
									JIM.register({
									    'username' : res.data.result,
										'password': _this.passData,
										'nickname' : _this.name,
										"gender":_this.skin?'1':'2'
									}).onSuccess(function(data) {
									    console.log('success:' + JSON.stringify(data));		
										uni.showToast({
											icon: 'success',
											position: 'bottom',
											title: '注册成功！'
										});
										_this.isRotate=false;
										var userLogin = {
											phone:_this.phoneData,
											password:_this.passData
										}
										uni.setStorageSync("userLogin",userLogin)
										uni.navigateTo({
											url:"./login"
										})
									}).onFail(function(data) {
										
										console.log('error:' + JSON.stringify(data))
										uni.request({
											url:SERVER_API+"appUser/deleteUser",
											data:{
												token:res.data.result
											},
											header:{
												token:"1111"
											},
											method:"POST",
											success() {
												uni.showToast({
													"title":"注册失败！请重试",
													"position":"bottom"
												})
											}
										})
										_this.isRotate=false;
									});
							});
						}else{
							uni.showToast({
								"title":res.data.message,
								"position":"bottom"
							})
							_this.isRotate=false;
						}	
					}
				})
		    }
		}
	}
</script>

<style>
	@import url("./css/main.css");
	@import url("../../colorui/icon.css");
	.flex {
		display: flex;
	}
	
	.flex-sub {
		flex: 1;
	}
	/* ==================
			 开关
	 ==================== */

	switch,
	checkbox,
	radio {
		position: relative;
	}

	switch::after,
	switch::before {
		font-family: "cuIcon";
		content: "\e645";
		position: absolute;
		color: #ffffff !important;
		top: 15%;
		left: 0upx;
		font-size: 26upx;
		line-height: 26px;
		width: 50%;
		text-align: center;
		pointer-events: none;
		transform: scale(0, 0);
		transition: all 0.3s ease-in-out 0s;
		z-index: 9;
		bottom: 0;
		height: 26px;
		margin: auto;
	}

	switch::before {
		content: "\e646";
		right: 0;
		transform: scale(1, 1);
		left: auto;
	}

	switch[checked]::after,
	switch.checked::after {
		transform: scale(1, 1);
	}

	switch[checked]::before,
	switch.checked::before {
		transform: scale(0, 0);
	}

	switch[checked]::before {
		transform: scale(0, 0);
	}

	switch .wx-switch-input,
	switch .uni-switch-input {
		border: none;
		padding: 0 24px;
		width: 48px;
		height: 26px;
		margin: 0;
		border-radius: 100upx;
	}

	switch .wx-switch-input:not([class*="bg-"]),
	switch .uni-switch-input:not([class*="bg-"]) {
		background: #8799a3 !important;
	}

	switch .wx-switch-input::after,
	switch .uni-switch-input::after {
		margin: auto;
		width: 26px;
		height: 26px;
		border-radius: 100upx;
		left: 0upx;
		top: 0upx;
		bottom: 0upx;
		position: absolute;
		transform: scale(0.9, 0.9);
		transition: all 0.1s ease-in-out 0s;
	}

	switch .wx-switch-input.wx-switch-input-checked::after,
	switch .uni-switch-input.uni-switch-input-checked::after {
		margin: auto;
		left: 22px;
		box-shadow: none;
		transform: scale(0.9, 0.9);
	}




	switch.radius .wx-switch-input::after,
	switch.radius .wx-switch-input,
	switch.radius .wx-switch-input::before,
	switch.radius .uni-switch-input::after,
	switch.radius .uni-switch-input,
	switch.radius .uni-switch-input::before {
		border-radius: 10upx;
	}

	switch .wx-switch-input::before,
	radio.radio::before,
	checkbox .wx-checkbox-input::before,
	radio .wx-radio-input::before,
	switch .uni-switch-input::before,
	radio.radio::before,
	checkbox .uni-checkbox-input::before,
	radio .uni-radio-input::before {
		display: none;
	}


	.switch-sex::after {
		content: "\e71c";
	}

	.switch-sex::before {
		content: "\e71a";
	}

	.switch-sex .wx-switch-input,
	.switch-sex .uni-switch-input {
		background: #e54d42 !important;
		border-color: #e54d42 !important;
	}

	.switch-sex[checked] .wx-switch-input,
	.switch-sex.checked .uni-switch-input {
		background: #3578E5 !important;
		border-color: #3578E5 !important;
	}

	switch.red[checked] .wx-switch-input.wx-switch-input-checked,
	checkbox.red[checked] .wx-checkbox-input,
	radio.red[checked] .wx-radio-input,
	switch.red.checked .uni-switch-input.uni-switch-input-checked,
	checkbox.red.checked .uni-checkbox-input,
	radio.red.checked .uni-radio-input {
		background-color: #e54d42 !important;
		border-color: #e54d42 !important;
		color: #ffffff !important;
	}

	switch.orange[checked] .wx-switch-input,
	checkbox.orange[checked] .wx-checkbox-input,
	radio.orange[checked] .wx-radio-input,
	switch.orange.checked .uni-switch-input,
	checkbox.orange.checked .uni-checkbox-input,
	radio.orange.checked .uni-radio-input {
		background-color: #f37b1d !important;
		border-color: #f37b1d !important;
		color: #ffffff !important;
	}

	switch.yellow[checked] .wx-switch-input,
	checkbox.yellow[checked] .wx-checkbox-input,
	radio.yellow[checked] .wx-radio-input,
	switch.yellow.checked .uni-switch-input,
	checkbox.yellow.checked .uni-checkbox-input,
	radio.yellow.checked .uni-radio-input {
		background-color: #fbbd08 !important;
		border-color: #fbbd08 !important;
		color: #333333 !important;
	}

	switch.olive[checked] .wx-switch-input,
	checkbox.olive[checked] .wx-checkbox-input,
	radio.olive[checked] .wx-radio-input,
	switch.olive.checked .uni-switch-input,
	checkbox.olive.checked .uni-checkbox-input,
	radio.olive.checked .uni-radio-input {
		background-color: #8dc63f !important;
		border-color: #8dc63f !important;
		color: #ffffff !important;
	}

	switch.green[checked] .wx-switch-input,
	switch[checked] .wx-switch-input,
	checkbox.green[checked] .wx-checkbox-input,
	checkbox[checked] .wx-checkbox-input,
	radio.green[checked] .wx-radio-input,
	radio[checked] .wx-radio-input,
	switch.green.checked .uni-switch-input,
	switch.checked .uni-switch-input,
	checkbox.green.checked .uni-checkbox-input,
	checkbox.checked .uni-checkbox-input,
	radio.green.checked .uni-radio-input,
	radio.checked .uni-radio-input {
		background-color: #39b54a !important;
		border-color: #39b54a !important;
		color: #ffffff !important;
		border-color: #39B54A !important;
	}

	switch.cyan[checked] .wx-switch-input,
	checkbox.cyan[checked] .wx-checkbox-input,
	radio.cyan[checked] .wx-radio-input,
	switch.cyan.checked .uni-switch-input,
	checkbox.cyan.checked .uni-checkbox-input,
	radio.cyan.checked .uni-radio-input {
		background-color: #1cbbb4 !important;
		border-color: #1cbbb4 !important;
		color: #ffffff !important;
	}

	switch.blue[checked] .wx-switch-input,
	checkbox.blue[checked] .wx-checkbox-input,
	radio.blue[checked] .wx-radio-input,
	switch.blue.checked .uni-switch-input,
	checkbox.blue.checked .uni-checkbox-input,
	radio.blue.checked .uni-radio-input {
		background-color: #0081ff !important;
		border-color: #0081ff !important;
		color: #ffffff !important;
	}

	switch.purple[checked] .wx-switch-input,
	checkbox.purple[checked] .wx-checkbox-input,
	radio.purple[checked] .wx-radio-input,
	switch.purple.checked .uni-switch-input,
	checkbox.purple.checked .uni-checkbox-input,
	radio.purple.checked .uni-radio-input {
		background-color: #6739b6 !important;
		border-color: #6739b6 !important;
		color: #ffffff !important;
	}

	switch.mauve[checked] .wx-switch-input,
	checkbox.mauve[checked] .wx-checkbox-input,
	radio.mauve[checked] .wx-radio-input,
	switch.mauve.checked .uni-switch-input,
	checkbox.mauve.checked .uni-checkbox-input,
	radio.mauve.checked .uni-radio-input {
		background-color: #9c26b0 !important;
		border-color: #9c26b0 !important;
		color: #ffffff !important;
	}

	switch.pink[checked] .wx-switch-input,
	checkbox.pink[checked] .wx-checkbox-input,
	radio.pink[checked] .wx-radio-input,
	switch.pink.checked .uni-switch-input,
	checkbox.pink.checked .uni-checkbox-input,
	radio.pink.checked .uni-radio-input {
		background-color: #e03997 !important;
		border-color: #e03997 !important;
		color: #ffffff !important;
	}

	switch.brown[checked] .wx-switch-input,
	checkbox.brown[checked] .wx-checkbox-input,
	radio.brown[checked] .wx-radio-input,
	switch.brown.checked .uni-switch-input,
	checkbox.brown.checked .uni-checkbox-input,
	radio.brown.checked .uni-radio-input {
		background-color: #a5673f !important;
		border-color: #a5673f !important;
		color: #ffffff !important;
	}

	switch.grey[checked] .wx-switch-input,
	checkbox.grey[checked] .wx-checkbox-input,
	radio.grey[checked] .wx-radio-input,
	switch.grey.checked .uni-switch-input,
	checkbox.grey.checked .uni-checkbox-input,
	radio.grey.checked .uni-radio-input {
		background-color: #8799a3 !important;
		border-color: #8799a3 !important;
		color: #ffffff !important;
	}

	switch.gray[checked] .wx-switch-input,
	checkbox.gray[checked] .wx-checkbox-input,
	radio.gray[checked] .wx-radio-input,
	switch.gray.checked .uni-switch-input,
	checkbox.gray.checked .uni-checkbox-input,
	radio.gray.checked .uni-radio-input {
		background-color: #f0f0f0 !important;
		border-color: #f0f0f0 !important;
		color: #333333 !important;
	}

	switch.black[checked] .wx-switch-input,
	checkbox.black[checked] .wx-checkbox-input,
	radio.black[checked] .wx-radio-input,
	switch.black.checked .uni-switch-input,
	checkbox.black.checked .uni-checkbox-input,
	radio.black.checked .uni-radio-input {
		background-color: #333333 !important;
		border-color: #333333 !important;
		color: #ffffff !important;
	}

	switch.white[checked] .wx-switch-input,
	checkbox.white[checked] .wx-checkbox-input,
	radio.white[checked] .wx-radio-input,
	switch.white.checked .uni-switch-input,
	checkbox.white.checked .uni-checkbox-input,
	radio.white.checked .uni-radio-input {
		background-color: #ffffff !important;
		border-color: #ffffff !important;
		color: #333333 !important;
	}

</style>