
/**
 * 确定弹窗
 * @param content
 * @returns {Promise<unknown>}
 */
export const showAlert=(content)=>{
	return new Promise((resolve,reject)=>{
		uni.showModal({
			title:'提示',
			content,
			showCancel:false,
			confirmColor:'#333333',
			success:function (res){
				if (res.confirm) {
					resolve(true)
				}
			},
		})
	})
}
/**
 * 获取样式
 */
export const getStyleStr = (styles)=>{
	let styleStr=''
	for(let i in styles){
		styleStr+=`${i}:${styles[i]};`
	}
	return styleStr
}

