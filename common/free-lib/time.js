export default{
	//标准时间转时间戳
	getDateTimeStamp(dateStr){
	 return ;
	},
	getTimeFormat (dateStr) {
	    if (dateStr) {
	      // let newData = Date.parse(new Date() + '')
	      // let diffTime = Math.abs(newData - valueTime)
		  var valueTime = Date.parse(dateStr.replace(/-/gi,"/"))
	      let diffTime = Math.abs(new Date().getTime() - new Date(valueTime).getTime())
	      if (diffTime > 7 * 24 * 3600 * 1000) {
	        let dayNum = Math.floor(diffTime / (24 * 60 * 60 * 1000))
	        return dayNum + '天前'
	      } else if (diffTime < 7 * 24 * 3600 * 1000 && diffTime > 24 * 3600 * 1000) {
	        // //注释("一周之内");
	        // var time = newData - diffTime;
	        let dayNum = Math.floor(diffTime / (24 * 60 * 60 * 1000))
	        return dayNum + '天前'
	      } else if (diffTime < 24 * 3600 * 1000 && diffTime > 3600 * 1000) {
	        // //注释("一天之内");
	        // var time = newData - diffTime;
	        let dayNum = Math.floor(diffTime / (60 * 60 * 1000))
	        return dayNum + '小时前'
	      } else if (diffTime < 3600 * 1000 && diffTime > 0) {
	        // //注释("一小时之内");
	        // var time = newData - diffTime;
	        let dayNum = Math.floor(diffTime / (60 * 1000))
	        return dayNum + '分钟前'
	      }
	    }
	  },
	// 计算当前日期星座
	getHoroscope(date) {
	  let c = ['摩羯','水瓶','双鱼','白羊','金牛','双子','巨蟹','狮子','处女','天秤','天蝎','射手','摩羯']
	  date=new Date(date);
	  let month = date.getMonth() + 1;
	  let day = date.getDate();
	  let startMonth = month - (day - 14 < '865778999988'.charAt(month));
	  return c[startMonth]+'座';
	},
	// 计算指定时间与当前的时间差
	sumAge(data){
		let dateBegin = new Date(data.replace(/-/g, "/"));
		let dateEnd = new Date();//获取当前时间
		let dateDiff = dateEnd.getTime() - dateBegin.getTime();//时间差的毫秒数
		let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
		let leave1=dateDiff%(24*3600*1000)    //计算天数后剩余的毫秒数
		let hours=Math.floor(leave1/(3600*1000))//计算出小时数
		//计算相差分钟数
		let leave2=leave1%(3600*1000)    //计算小时数后剩余的毫秒数
		let minutes=Math.floor(leave2/(60*1000))//计算相差分钟数
		//计算相差秒数
		let leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
		let seconds=Math.round(leave3/1000)
		return dayDiff+"天 "+hours+"小时 ";
	},
	// 获取聊天时间（相差300s内的信息不会显示时间）
	getChatTime(v1,v2){
		v1=v1.toString().length<13 ? v1*1000 : v1;
		v2=v2.toString().length<13 ? v2*1000 : v2;
		if(((parseInt(v1)-parseInt(v2))/1000) > 300){
			return this.getchattime(v1);
		}
	},
	// 人性化时间格式
	gettime(shorttime){
		shorttime=shorttime.toString().length<13 ? shorttime*1000 : shorttime;
		let now = (new Date()).getTime();
		let cha = (now-parseInt(shorttime))/1000;
		
		if (cha < 60*60*12) {
			// 当天
			return this.dateFormat(new Date(shorttime),"{hh}:{ii}");
		} else if(cha < 60 * 60 * 24 * 365){
			// 隔天 显示日期+时间
			return this.dateFormat(new Date(shorttime),"{Mon}月{DD}日");
		} else {
			// 隔年 显示完整日期+时间
			return this.dateFormat(new Date(shorttime),"{Y}-{MM}-{DD}");
		}
	},
	
	isYesterday(time) {
		 const date = new Date();
		 const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();
		const today = `${year}/${month}/${day}`; 
		const todayTime = new Date(today).getTime(); // 当天凌晨的时间
		const yesterdayTime = new Date(todayTime - 24 * 60 * 60 * 1000).getTime(); // 昨天凌晨的时间
		return time < todayTime && yesterdayTime <= time;
	},
	
	// 人性化时间格式
	getchattime(shorttime){
		shorttime=shorttime.toString().length<13 ? shorttime*1000 : shorttime;
		let now = (new Date()).getTime();
		let cha = (now-parseInt(shorttime))/1000;
		
		if (cha < 60*60*12) {
			// 当天
			return this.dateFormat(new Date(shorttime),"{A} {h}:{ii}");
		} else if(cha < 60 * 60 * 24 * 365){
			//昨天
			if(this.isYesterday(shorttime)){
				return '昨天 '+this.dateFormat(new Date(shorttime),"{h}:{ii}");
			}else{
				// 隔天 显示日期+时间
				return this.dateFormat(new Date(shorttime),"{Mon}月{DD}日 {A} {h}:{ii}");
			}
		} else {
			// 隔年 显示完整日期+时间
			return this.dateFormat(new Date(shorttime),"{Y}-{MM}-{DD} {A} {h}:{ii}");
		}
	},
	
	parseNumber(num) {
		return num < 10 ? "0" + num : num;
	},
	 
	dateFormat(date, formatStr) {
		let dateObj = {},
			rStr = /\{([^}]+)\}/,
			mons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
		 
		dateObj["Y"] = date.getFullYear();
		dateObj["M"] = date.getMonth() + 1;
		dateObj["MM"] = this.parseNumber(dateObj["M"]);
		dateObj["Mon"] = mons[dateObj['M'] - 1];
		dateObj["D"] = date.getDate();
		dateObj["DD"] = this.parseNumber(dateObj["D"]);
		dateObj["h"] = date.getHours();
		dateObj["hh"] = this.parseNumber(dateObj["h"]);
		dateObj["t"] = dateObj["h"] > 12 ? dateObj["h"] - 12 : dateObj["h"];
		dateObj["tt"] = this.parseNumber(dateObj["t"]);
		var str;
		if(dateObj["h"] < 12){
			str = "上午"
		}else if(dateObj["h"] < 18){
			str = "下午"
		}else{
			str = "晚上"
		}
		dateObj["A"] = str;
		dateObj["i"] = date.getMinutes();
		dateObj["ii"] = this.parseNumber(dateObj["i"]);
		dateObj["s"] = date.getSeconds();
		dateObj["ss"] = this.parseNumber(dateObj["s"]);
	 
		while(rStr.test(formatStr)) {
			formatStr = formatStr.replace(rStr, dateObj[RegExp.$1]);
		}
		return formatStr;
	},
	// 获取年龄
	getAgeByBirthday(data){
		let birthday=new Date(data.replace(/-/g, "\/")); 
		let d=new Date(); 
		return d.getFullYear()-birthday.getFullYear()-((d.getMonth()<birthday.getMonth()|| d.getMonth()==birthday.getMonth() && d.getDate()<birthday.getDate())?1:0);
	},
	//判断当前时间是否在stime-etime之间
	checkTime(stime, etime) {
		console.log(stime+"==="+etime)
	  //开始时间
	  var arrs = stime.split("-");
	  var startTime = new Date(arrs[0], arrs[1], arrs[2]);
	  var startTimes = startTime.getTime();
	  //结束时间
	  var arre = etime.split("-");
	  var endTime = new Date(arre[0], arre[1], arre[2]);
	  var endTimes = endTime.getTime();
	  //当前时间
	  var thisDate = new Date();
	  var thisDates = thisDate.getFullYear() + "-0" + (thisDate.getMonth() + 1) + "-" + thisDate.getDate();
	  var arrn = thisDates.split("-");
	  var nowTime = new Date(arrn[0], arrn[1], arrn[2]);
	  var nowTimes = nowTime.getTime();
	  if (nowTimes < startTimes || nowTimes > endTimes) {
	    return false;
	  }
	  return true;
	}
}