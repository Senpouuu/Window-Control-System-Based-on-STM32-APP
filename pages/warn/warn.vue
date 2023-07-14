<template>
<view>

		<view v-if="BreakData.length!=0" class="wrapper">
				<view v-for="(item,index) in BreakData" :key="index" @longpress="onLongPress" :class="{'active':pickerUserIndex==index}"  :data-index="index">
					<view class="warn-cart">
						<view class="device-info">
							<view class="warn-time">{{item.at.substring(0,19)}}</view>
							<view class="warn-name">检测到有人经过</view>
						</view>
						<image class="warn-logo" src="/static/HumanSensor.png"></image>
					</view>

				</view>
		</view>
		
		<view v-else>
			 <o-empty/>
		</view>	
		
		<view class="shade" v-show="showShade" @tap="hidePop">
			<view class="pop" :style="popStyle" :class="{'show':showPop}">
				<view v-for="(item,index) in popButton" :key="index" @tap="pickerMenu" :data-index="index">{{item}}</view>
			</view>
		</view>
		
</view>
		
</template>

<script>
	export default {
		data() {
			return {
				MyTime: "",
				BreakData: [],
				
				winSize: {},
				/* 显示遮罩 */
				showShade: false,
				/* 显示操作弹窗 */
				showPop: false,
				/* 弹窗按钮列表 */
				popButton: ["删除"],
				/* 弹窗定位样式 */
				popStyle: "",
				/* 选择的用户下标 */
				pickerUserIndex: -1
			};
		},

		onShow() {
			let that = this
			this.GetMyTime()
			this.GetBreakData()
			this.getWindowSize();
			//setInterval(function() {
			//	that.GetBreakData()
			//}, 1000);
			
			// #ifdef H5
			document.onLong = function(e) {
				var e = e || window.event;
				e.preventDefault();
			};
			// #endif
			
			
		},

	onPullDownRefresh(){
		this.getFinishprocess();
		uni.stopPullDownRefresh();
		
	},
	methods: {
	getFinishprocess(){
		this.GetBreakData();
	},
	
	getWindowSize() {
		uni.getSystemInfo({
			success: (res) => {
				this.winSize = {
					"witdh": res.windowWidth,
					"height": res.windowHeight
				}
			}
		})
	},
	GetBreakData() {
	uni.request({
	method: 'GET',
	//url:'http://api.heclouds.com/devices/1044148397/datapoints?datastream_id=BreakTimes&start=2023-02-13T00:00:00&limit=200',
	url: 'http://api.heclouds.com/devices/1044148397/datapoints?datastream_id=BreakTimes&start='+this.MyTime+'&limit=200', //接口API。
	header: {
		'api-key': 'xrXOFe50Hmp4CakHLqZIjSfMcPQ=' //API KEY	
	},
	success: (res) => {
		this.BreakData = res.data.data.datastreams[0].datapoints;
	}
	});
	},

			GetMyTime() {
				let BreakData = this.BreakData
				let time = new Date()
				let y = time.getFullYear() // 可返回一个表示年份的 4 位数字
				let m = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() +
					1 // 可返回表示月份的数字。返回值是 0（一月） 到 11（十二月） 之间的一个整数 // 注意： 一月为 0, 二月为 1, 以此类推。
				let d = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
				let h = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
				let min = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
				let seconds = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds()
				//this.MyTime = ""+ y+"-"+M+"-"+d+"T"+h+":"+m+":"+s +"";
				this.MyTime = "" + y + "-" + m + "-" + d + "T00:00:00" + "";
				//this.MyTime = this.BreakData[index].at.substring(0,10)+'T'+this.BreakData[0].at.substring(11,19);
				
			},

			onLongPress(e) {
				let [touches, style, index] = [e.touches[0], "", e.currentTarget.dataset.index];
			
				/* 因 非H5端不兼容 style 属性绑定 Object ，所以拼接字符 */
				if (touches.clientY > (this.winSize.height / 2)) {
					style = `bottom:${this.winSize.height-touches.clientY}px;`;
				} else {
					style = `top:${touches.clientY}px;`;
				}
				if (touches.clientX > (this.winSize.witdh / 2)) {
					style += `right:${this.winSize.witdh-touches.clientX}px`;
				} else {
					style += `left:${touches.clientX}px`;
				}
			
				this.popStyle = style;
				this.pickerUserIndex = Number(index);
				this.showShade = true;
				this.$nextTick(() => {
					setTimeout(() => {
						this.showPop = true;
					}, 10);
				});
			},
			 
			 hidePop() {
			 	this.showPop = false;
			 	this.pickerUserIndex = -1;
			 	setTimeout(() => {
			 		this.showShade = false;
			 	}, 250);
			 },
			 
			 /* 选择菜单 */
			 pickerMenu(e) {
			 	this.BreakData.splice(this.pickerUserIndex, 1);
			 		//console.log(index);
			 	uni.showToast({
			 	    title: `删除成功`,
			 		
			 	});
			
			 },
			 		
			PutDatapoints() {
				let BreakNum = this.BreakNum;
				uni.request({
					method: 'POST',
					url: 'http://api.heclouds.com/mqtt?topic=Window_Switch', //接口API。
					header: {
						'api-key': 'xrXOFe50Hmp4CakHLqZIjSfMcPQ=' //API KEY	
					},
					data: "BreakNum:" + BreakNum + "",
					success: (res) => {

					}
				});
			}

		},


	}
</script>

<style lang="scss">
	@import '/common/animate.min.css';
	.bgc {
		margin-top: 1000rpx;
		display: block;
		width: 100rpx;
		height: 100rpx;
		margin: 0 auto;
	}

	.wrapper {
		padding: 30rpx;
		animation: slideInRight;
		animation-duration: 1s;
		animation-iteration-count: 1;
		
	}

	.device-area {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap; //换行

	}

	.warn-cart {
		width: 700rpx;
		height: 100rpx;
		border-radius: 15rpx; //椭圆边框
		margin-top: 30rpx; //间隔
		display: flex;
		flex-wrap: wrap; //换行
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

	.warn-time {
		margin-left: 10rpx;
		font-size: 27rpx;
		text-align: left;
		color: #6d6d6d;
	}

	.warn-name {
		text-align: left;
		margin-left: 10rpx;
		margin-top: 5rpx;
		font-size: 45rpx;
		font-weight: normal;
		color: #6d6d6d;
	}

	.warn-logo {
		width: 70rpx;
		height: 70rpx;
		margin-left: 270rpx;
		margin-top: 15rpx;
	}

	
	.life-index {
		margin-top: 10rpx;
		background-color: #f5f5f5;
		animation: slideInLeft;
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
	
	
	/* 遮罩 */
	.shade {
		position: fixed;
		z-index: 100;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		-webkit-touch-callout: none;
	
		.pop {
			position: fixed;
			z-index: 101;
			width: 120upx;
			box-sizing: border-box;
			font-size: 35rpx;
			text-align: center;
			opacity:0.8;
			border-radius: 15rpx; //椭圆边框
			color: #DBDBDB;
			background-color: #4B4B4B;
			box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
			line-height: 80upx;
			transition: transform 0.15s ease-in-out 0s;
			user-select: none;
			-webkit-touch-callout: none;
			transform: scale(0, 0);
	
			&.show {
				transform: scale(1, 1);
			}
	
			&>view {
				padding: 0 20upx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				user-select: none;
				-webkit-touch-callout: none;
	
				&:active {
					background-color: #4B4B4B;
				}
			}
		}
	}
	
</style>
