<template>
	<image :src="getSrc" mode="aspectFill" :style="getStyle" :class="type" @click="clickEvent"></image>
</template>

<script>
	export default {
		props: {
			size:{
				type:[String,Number],
				default:90
			},
			src: {
				type: String,
				default: ""
			},
			type:{
				type:String,
				default:"rounded"
			},
			token:{
				type:String,
				default:""
			},
			clickType:{
				type:String,
				default:"none"
			}
		},
		computed: {
			getSrc(){
				if(this.src.indexOf("Android")!=-1&&this.src.indexOf("file://")==-1){
					return "file://"+this.src;
				}else{
					return this.src
				}
			},
			getStyle() {
				return `width: ${this.size}rpx;height: ${this.size}rpx;`
			}
		},
		methods: {
			clickEvent() {
				switch (this.clickType){
					case 'navigate':
					uni.navigateTo({
						url: `/pages/mail/user-base/user-base?token=${this.token}`
					});
						break;
					case 'preview':
						uni.previewImage({
							urls:[this.getSrc]
						})
						break;
					default:
					this.$emit('click')
						break;
					
				}
			}
		},
	}
</script>

<style>
</style>
