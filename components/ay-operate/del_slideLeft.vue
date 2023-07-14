<template>
	<view>
		<view class="box-slideLeft" >
			<view class="touch-item touch-slideLeft " @touchstart="touchS" @touchmove="touchM" @touchend="touchE"  :style="item_show.txtStyle">
				<slot />
			</view>
			
			<view class="touch-item del-box-touch-slideLeft cf-shuCenter"  @click="delItem(item_show)">
				<view class="iconfont icon-shanchu"></view>
			</view>

		</view>
	</view>
</template>

<script>
	
	export default {
		components: {

		},
		props: {
			
			data_transit: {
				type: Object,
				default () {
					return {}
				}
			},
			//可不传参
			item: {
				type: Object,
				default () {
					return {}
				}
			},
		},
		computed: {

		},
		
		data() {
			return {
				
				item_show : {},
				delBtnWidth: 60, //删除按钮宽度单位（rpx）
				startX: '',
			};
		},
		created:function(){
			//专门处理检查对象中，某字段是否存在的，如果存在返回 true 不存在返回 false
			let that = this ;
			let item = that.item ;
			if(!item.hasOwnProperty("txtStyle")){
				this.$set(this.item,'txtStyle','');//不需要初始化了
			}
			this.item_show = this.item ;
		},
		watch: {
			item(e){
				this.item_show = e ;
			},
		},
		methods: {
			//点击删除按钮事件
			delItem: function(e) {
				let that = this;
				let data ={
					item : e ,
					data : that.data_transit ,
				};
				this.$emit('delItem', data);
			},
			touchS: function(e) {
				let that = this;
				
				if (e.touches.length == 1) {
					//设置触摸起始点水平方向位置
					this.startX = e.touches[0].clientX
					
				}
			},
			touchM: function(e) {
				let that = this;
				
				if (e.touches.length == 1) {
					//手指移动时水平方向位置
					var moveX = e.touches[0].clientX;
					//手指起始点位置与移动期间的差值
					var disX = this.startX - moveX;
					var delBtnWidth = this.delBtnWidth;
					var txtStyle = "";
					if (disX == 0 || disX < 0) { //如果移动距离小于等于0，说明向右滑动，文本层位置不变
						txtStyle = "left:0px";
					} else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离
						txtStyle = "left:-" + disX + "px";
						if (disX >= delBtnWidth) {
							//控制手指移动距离最大值为删除按钮的宽度
							txtStyle = "left:-" + delBtnWidth + "px";
						}
					}
					//获取手指触摸的是哪一项
					
					that.item_show.txtStyle = txtStyle;
					
				}
			},
			touchE: function(e) {
				let that = this;
				if (e.changedTouches.length == 1) {
					//手指移动结束后水平位置
					var endX = e.changedTouches[0].clientX;
					//触摸开始与结束，手指移动的距离
					var disX = this.startX - endX;
					var delBtnWidth = this.delBtnWidth;
					//如果距离小于删除按钮的1/2，不显示删除按钮
					var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
					//获取手指触摸的是哪一项
					that.item_show.txtStyle = txtStyle;
					
				}
			},
			
		}

	}
</script>

<style lang="scss">
	@import './iconfont.css';//便于有删除图标
	
	.box-slideLeft {
		view {
			box-sizing: border-box;
		}
		position: relative;
		overflow: hidden;
		
		.touch-item {
			position: absolute;
			top: 0;
			padding: 10px 10px 10px;
			background-color: #FFFFFF;
			// border-radius: 10px;
			overflow: hidden;
		}
		
		.touch-slideLeft {
			position: relative;
			width: 100%;
			z-index: 5;
			transition: left 0.2s ease-in-out;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.del-box-touch-slideLeft {
			right: 0;
			float: left;
			width: 70px;
			height: 100%;
			line-height: 101px;
			background-color: #EA5863;
			border-radius: 0 10px 10px 0;
			color: #fff;
			font-size: 18px;
			font-weight: lighter;
			text-align: center;
		}
		.icon-shanchu{
			font-size: 44upx;
		}
		
		.cf-shuCenter{
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			
		}
	}

	
</style>

