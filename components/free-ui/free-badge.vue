<template>
	<text class="free-badge bg-danger text-white rounded-circle font-small position-absolute" :class="getClass"   :style="badgeStyle">{{Number(value)>99?'99':value}}</text>
</template>

<script>
	export default {
		props: {
			badgeClass: {
				type: String,
				default: ""
			},
			badgeStyle:{
				type:String,
				default:""
			},
			value:{
				type:[Number,String],
				default:""
			}
		},
		computed:{
			getClass(){
				return Number(this.value)>10? 'free-badge2' : 'free-badge';
			}
		}
	}
</script>

<style scoped>
	.free-badge{
		padding-left: 13rpx;padding-right: 13rpx;padding-bottom: 6rpx;padding-top: 6rpx; 
	}
	.free-badge2{
		padding-left: 6rpx;padding-right: 6rpx;padding-bottom: 6rpx;padding-top: 6rpx;
	}
</style>
