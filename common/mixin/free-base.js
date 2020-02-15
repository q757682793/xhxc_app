import $Time from "@/common/free-lib/time.js"
export default {
	filters: {
		formatTime(value) {
			return $Time.gettime(value);
		},
		formatNumber(value){
			if(Number(value)<1000){
				return value;
			}
			if(Number(value)<10000){
				return value.substring(0,1)+'k+';
			}
			if(Number(value)>=10000){
				return value.substring(0,value.length-4)+'w+';
			}
		}
	},
}