<template>
	<view>
		<view class="wrapper">
			<view class="box">
				<oea-weather gd_key="6abe723db7fa202d592cae15f5c581f1" adcode="410100"></oea-weather>
				<oea-separate bottom="20px"></oea-separate>
			</view>
			<view class="life-index">
				<view class="title">环境监测</view>
			</view>

			<view class="device-area">
				<view class="device-cart">
					<view class="device-info">
						<view class="device-name">温度</view>
						<image class="device-logo" src="/static/Temp.png"></image>
					</view>
					<view class="device-data">{{temp}}°C</view>

				</view>

				<view class="device-cart">
					<view class="device-info">
						<view class="device-name">湿度</view>
						<image class="device-logo" src="/static/Humi.png"></image>
					</view>
					<view class="device-data">{{humi}}%RH</view>

				</view>

				<view class="device-cart">
					<view class="device-info">
						<view class="device-name">亮度</view>
						<image class="device-logo" src="/static/Lux.png"></image>
					</view>
					<view class="device-data">{{Lux}}Lx</view>

				</view>

				<view class="device-cart">
					<view class="device-info">
						<view class="device-name">烟雾</view>
						<image class="device-logo" src="/static//smoke.png"></image>
					</view>
					<view class="device-data">{{ppm}}mg/L</view>

				</view>

				<view class="device-cart">
					<view class="device-info">
						<view class="device-name">风速</view>
						<image class="device-logo" src="/static//WindSpee.png"></image>
					</view>
					<view class="device-data">{{WindSpeed}}m/s</view>

				</view>

				<view v-if="loading==true" class="device-cart">
					<view class="device-info">
						<view class="device-name">窗户</view>
						<image class="device-logo" src="/static/Window.png"></image>
					</view>
					<view class="switch-box">
						<switch @change="onSwitch" :checked="Check" :disabled="disable" color="#696969" />
						<div class="line-wobble"></div>
					</view>
				</view>

				<view v-else class="device-cart">
					<view class="device-info">
						<view class="device-name">窗户</view>
						<image class="device-logo" src="/static/Window.png"></image>
					</view>
					<view>
						<switch @change="onSwitch" :checked="Check" color="#696969" />
					</view>
				</view>
				 
			</view>
		</view>
			<view v-if="this.device == '设备在线'" class="update-text">
				<view class="dot-online"></view>
				<view class="title">  {{device}}</view>
			</view>
			<view v-if="this.device == '设备离线'" class="update-text">
				<view class="dot-offline"></view>
				<view class="title">  {{device}}</view>
			</view>
			<view class="update-text">
				<view class="title">更新于：{{updatetime}}</view>
			</view>
	</view>
	
	
</template>

<script>
	export default {
		data() {
			return {

				temp: 0,
				humi: 0,
				Lux: 0,
				ppm: 0,
				WindSpeed:0,
				Check: 0,
				WindowCondition: true,
				loading: false,
				disable: false,
				fail: false,
				updatetime: 0,
				device:'',
				upload:1,

				//输入的搜索城市名
				cityName: '郑州',
				//搜索到的城市列表(暂时只显示一个)
				cityList: [],
				//生活指数
				lifeIndex: [],
				//天气信息
				weatherInfo: {},
				imgUrl: "",
				time: ""
			}
		},
		watch: {
			weatherInfo(newVal, oldVal) {
				console.log("新", newVal, "旧", oldVal)
				this.imgUrl = "../../static/weather_icon/" + newVal.icon + ".png"
			}
		},

		computed: {
			myTime() {
				return this.time.slice(0, 10) + " " + this.time.slice(11, 16)
			}
		},

		onLoad() {
			this.search()
		},

		onPullDownRefresh() {
			this.getFinishprocess();
			uni.stopPullDownRefresh();
			this.search(() => {
				uni.stopPullDownRefresh()
				uni.showToast({
					title: "更新天气成功",
					icon: "success"
				})
			})
		},

		onShow() {
			let that = this
			this.GetDatapoints()
			if(this.upload == 1)
			{
				setInterval(function() {
					that.GetDatapoints()
				}, 1000);
			}
			
		},
		

		methods: {
			
			getFinishprocess(){
				this.GetDatapoints();
			},
			
			GetDatapoints() {
				uni.request({
					method: 'GET',
					url: 'http://api.heclouds.com/devices/1044148397/datapoints', //接口API。
					header: {
						'api-key': 'P=6=lG7jDwtT1A8FAA1UDWrBCcY=' //API KEY	
					},
					success: (res) => {

						// console.log(res.data.data.datastreams[0].id,res.data.data.datastreams[0].datapoints[0].value);
						// console.log(res.data.data.datastreams[1].id,res.data.data.datastreams[1].datapoints[0].value);
						this.temp = res.data.data.datastreams[0].datapoints[0].value;
						this.humi = res.data.data.datastreams[4].datapoints[0].value;
						this.Lux = res.data.data.datastreams[7].datapoints[0].value;
						this.ppm = res.data.data.datastreams[6].datapoints[0].value;
						this.WindSpeed = res.data.data.datastreams[3].datapoints[0].value;
						this.Check = res.data.data.datastreams[5].datapoints[0].value;
						this.updatetime = res.data.data.datastreams[0].datapoints[0].at.substring(0,19);
						//this.device = res.data.data.datastreams[2].datapoints[0].value;
						if(this.Check == 1 )
						{
							this.Check = true;
						}
						else
						{
							this.Check = false;
						}
						if(this.temp < 5 && this.humi < 5)
						{
							this.temp = 0;
							this.humi = 0;
						}

					}
				});
				
				uni.request({
					method: 'GET',
					url: 'http://api.heclouds.com/devices/status?devIds=1044148397', //接口API。
					header: {
						'api-key': 'xrXOFe50Hmp4CakHLqZIjSfMcPQ=' //API KEY	
					},
					success: (res) => {
						this.device = res.data.data.devices[0].online;
						if(this.device == true )
						{
							this.device = '设备在线';
						}
						else
						{
							this.device = '设备离线';
						}		
					},
					
				});
				
			},
			
		
			sleep(time){
			 return new Promise((resolve) => setTimeout(resolve, time));
			},
			
			
		async onSwitch(event) {
				let WindowCondition = event.detail.value;
				//关->开
				if (WindowCondition) {
					this.disable = true;
					this.loading = true;
					uni.request({
						method: 'POST',
						url: 'http://api.heclouds.com/mqtt?topic=Window_Switch', //接口API。
						header: {
							'api-key': 'xrXOFe50Hmp4CakHLqZIjSfMcPQ=' //API KEY	
						},
						data: "LED_ON",
						success: (res) => {
							console.log("LEDON");
							this.upload = 0;
						}
					});
					for (var i = 1; i < 30; i++) 
					{
						this.fail = true;
						await this.sleep(1000);
						if (this.Check == true) 
						{
							this.disable = false;
							this.loading = false;
							this.fail = false;
							break;
						}
					}
					this.loading = false;
					this.Check = true;
					if(this.fail == true)
					{
						uni.showToast({
							title: ` 服务器响应超时\r\n窗户开启失败`,
							icon:'error',
							duration: 2000	
						})
						this.upload = 1;
					}
					else
					{
						uni.showToast({
							title: `窗户开启成功`,
							icon:'success',
							duration: 2000	
						})
						this.upload = 1;
					}


					//关闭
				} else {
					this.disable = true;
					this.loading = true;
					uni.request({
						method: 'POST',
						url: 'http://api.heclouds.com/mqtt?topic=Window_Switch', //接口API。
						header: {
							'api-key': 'xrXOFe50Hmp4CakHLqZIjSfMcPQ=' //API KEY	
						},
						data: "LED_OFF",
						success: (res) => {
							console.log("LEDOFF");
							this.upload = 0;
						}
					});

					for (var i = 1; i < 30; i++) 
					{
						this.fail = true;
						await this.sleep(1000);
						if (this.Check == false) 
						{
							this.disable = false;
							this.loading = false;
							this.fail = false;
							break;
						}
					}

					this.loading = false;
					this.Check = false;
					
					if(this.fail == true)
					{
						uni.showToast({
							title: ` 服务器响应超时\r\n窗户关闭失败`,
							icon:'error',
							duration: 2000	
						})
						this.upload = 1;
					}
					else
					{
						uni.showToast({
							title: `窗户关闭成功`,
							icon:'success',
							duration: 2000	
						})
						this.upload = 1;
		
					}
					
				}
			},


		

			//查询城市

			async search(callBack) {
				const res = await this.$myRequest({
					url: "/v2/city/lookup",
					data: {
						location: this.cityName,
						number: 1,
						isSearch: 1
					}
				})
				console.log(res)
				this.cityList = res.location[0]
				this.getLifeIndex()
				this.getWeatherInfo()
				this.getWeatherOneDay()
				callBack && callBack()
			},
			//获取实时天气

			getWeatherInfo() {
				this.$myRequest({
					url: "/v7/weather/now",
					data: {
						location: this.cityList.id
					}
				}).then((res) => {
					this.weatherInfo = res.now
					this.time = res.now.obsTime
				})
			},
			//获取未来24小时天气预报

			getWeatherOneDay() {
				this.$myRequest({
					url: "/v7/weather/24h",
					data: {
						location: this.cityList.id
					}
				}).then((res) => {
					console.log(res)
				})
			},
			//获取生活指数

			getLifeIndex() {
				this.$myRequest({
					url: "/v7/indices/1d",
					data: {
						location: this.cityList.id,
						type: 0
					}
				}).then((res) => {
					this.lifeIndex = res.daily
				})
			}
		}
	}
</script>

<style lang="scss">
	/* 引入animate.css */
	@import '/common/animate.min.css';
	.wrapper {
		padding: 20rpx;
	}
	.box {
		animation: slideInLeft;
		animation-duration: 1s;
		animation-iteration-count: 1;
	}

	.device-area {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap; //换行
		animation: slideInRight;
		animation-duration: 1s;
		animation-iteration-count: 1;

	}

	.device-cart {
		width: 320rpx;
		height: 150rpx;
		border-radius: 30rpx; //椭圆边框
		margin-top: 30rpx; //间隔
		align-items: center;
		display: flex;
		justify-content: space-around;
		box-shadow: 0 0 15rpx #8f8f94; //投影.
		

	}

	.device-data {
		font-size: 50rpx;
		color: #696969;
	}


	.device-info {

		font-size: 20rpx;
		/* background: #8f8f94; */
	}

	.device-name {
		text-align: center;
		color: #6d6d6d;
	}

	.device-logo {
		width: 60rpx;
		height: 60rpx;
		margin-top: 10rpx;
	}

	.switch-box {
		margin-top: 18rpx;
	}

	.update-text{
		font-size: 15px;
		display: flex;
		justify-content: center;
		color: #696969;
		animation: slideInRight;
		animation-duration: 1s;
		animation-iteration-count: 1;
	}
	
	.dot-offline{
			margin-top: 5px;
			margin-right: 3px;
		  	background:red;
		  	border-radius:50%;
		  	width:10px;
		  	height:10px;
			display:inline-block;
	}
	.dot-online{
			margin-top: 5px;
			margin-right: 3px;
		  	background:yellowgreen;
		  	border-radius:50%;
		  	width:10px;
		  	height:10px;
			display:inline-block;
	}
	
	.content {
		display: flex;
		flex-direction: column;
	}

	.top-info-box {
		padding: 30rpx 0 20rpx 0;
		background-color: #5CACEE;
		display: flex;
		flex-direction: column;
		align-items: center;
		color: #fff;
		font-size: rpx;
		position: relative;

		.time {
			position: absolute;
			right: 10rpx;
			top: 10rpx;
			font-size: 20rpx;
			display: flex;
			flex-direction: column;
		}

		.line {
			margin: 0 10rpx;
		}

		.address {
			font-size: 40rpx;
		}

		.temp {
			font-size: 75rpx;
			margin-top: 20rpx;
		}

		.condition {
			margin: 20rpx 0;
			display: flex;

			image {
				margin-right: 10rpx;
				width: 50rpx;
				height: 50rpx;
			}
		}
	}

	.life-index {
		background-color: #f5f5f5;
		animation: zoomIn;
		animation-duration: 1s;
		animation-iteration-count: 1;
		.title {
			text-align: center;
			height: 80rpx;
			line-height: 80rpx;
			box-shadow: 0 0 15rpx #8f8f94; //投影.
			font-size: 50rpx;
			color: #696969;
		}

		.item {
			border-bottom: 1px solid #007AFF;
			padding: 26rpx 34rpx;

			.name {
				font-size: 36rpx;
			}

			.advice {
				font-size: 24rpx;
			}
		}
	}

	.weather{
		border-radius: 30rpx; //椭圆边框
		width: 750rpx;
		height: 1000rpx;
		animation: slideInRight;
		animation-duration: 1s;
		animation-iteration-count: 1;
	}
	
	.line-wobble {
		--uib-size: 50px;
		--uib-speed: 1.55s;
		--uib-color: #696969;
		--uib-line-weight: 5px;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		height: var(--uib-line-weight);
		width: var(--uib-size);
		border-radius: calc(var(--uib-line-weight) / 2);
		overflow: hidden;
		transform: translate3d(0, 0, 0);
		margin-top: 10rpx;
	}
	
	.line-wobble::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		background-color: var(--uib-color);
		opacity: 0.1;
	}
	
	.line-wobble::after {
		content: '';
		height: 100%;
		width: 100%;
		border-radius: calc(var(--uib-line-weight) / 2);
		animation: wobble var(--uib-speed) ease-in-out infinite;
		transform: translateX(-90%);
		background-color: var(--uib-color);
	}
	
	@keyframes wobble {
	
		0%,
		100% {
			transform: translateX(-90%);
		}
	
		50% {
			transform: translateX(90%);
		}
	}
</style>
