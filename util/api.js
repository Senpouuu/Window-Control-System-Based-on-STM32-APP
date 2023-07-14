const url1 = "https://geoapi.qweather.com"
const url2= "https://devapi.qweather.com"
export const myRequest = (options) =>{
	const MY_KEY="06465adf5511443fa1114fec9119b357" //参数中加入开发者key
	options.data?options.data.key = MY_KEY:options.data={key:MY_KEY}
	
	//判断接口是否为获取城市
	if('isSearch' in options.data){
		var BASE_URL = url1
		delete options.data.isSearch
	}else{
		var BASE_URL = url2
	}
	return new Promise((resolve,reject)=>{
		uni.request({
			url:BASE_URL+options.url,
			method:options.method || 'GET',
			data:options.data,
			success:(res)=>{
				resolve(res.data)
			},
			fail:(err)=>{
				uni.showToast({
					title:"请求接口失败",
					icon:"error"
				})
				reject(err)
			}
		})
	})
}