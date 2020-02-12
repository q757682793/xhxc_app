export function checkUpdater(currentId) {
    uni.request({
        url: 'http://117.83.152.39:8081/interconnect/appWeb/getVersion',
        method: 'GET',
        success: res => {
			// console.log(res)
            if (res.statusCode === 200) {
                const response = res.data
                const latestVersion = response.version
                const url = response.url
				var currentVersion =  Number(currentId.substring(0,3)+currentId.substring(4))
                if (currentVersion<latestVersion) {				
					// console.log('任务开始')
					let downloadTask = uni.downloadFile({
						url: url,
						success: (res) => {
							if (res.statusCode === 200) {
								// 保存下载的安装包
								// console.log('保存安装包')
								uni.saveFile({
									tempFilePath: res.tempFilePath,
									success: (res) => {
										const packgePath = res.savedFilePath
										// 保存更新记录到stroage，下次启动app时安装更新
										uni.setStorage({
											key: 'updated',
											data: {
												completed: false,
												packgePath: packgePath,
												content:response.content
											},
											success: () => {
												// console.log('成功保存记录')
											}
										}) 
										// 任务完成，关闭下载任务
										// console.log('任务完成，关闭下载任务，下一次启动应用时将安装更新')
										downloadTask.abort()
										downloadTask = null
									}
								})
							}
						}
					})         
                }else{
					// console.log("已经是最新版本")
				}
            }
        }
    })
}