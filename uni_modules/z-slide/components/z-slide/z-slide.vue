<template>
	<view class="slide" >
		<view class="box" v-for="(value,keys) in dataList" :key="value.id" @touchmove="touchMove($event,keys)"
			@touchend="touchEnd($event,keys)"
			:style="{'transform': 'translateX('+value.slide_x+'px)',transition:time+'s'}">
			<view class="slide-content">
				<slot :obj="value"></slot>
			</view>
			<view class="tagBox" id="tagBox">
				<slot name="btnList" :obj="keys"></slot>
				<view class="tag" v-for="(item,index) in btnList" :key="item.id"
					:style="{...item,width:item.width||'auto',height:item.height||'100%'}"
					@click="clickTag(item,keys)">
					{{item.text}}
				</view>
			</view>
		</view>
	</view>
</template>

<script> 
	export default {
		name: 'z-slide',
		data() {
			return {
				max_x: 0,    //计算出当前 至多可以移动的位移
				touchList: [],     //touchmove过程中的点的位置
				time: 0,      //动画执行时间  单位为s
				list: []     //渲染的数据
			}
		},
		props: {
			//按钮数组
			btnList: {
				type: Array,
				default: () => {
					return []
				}
			},
			
			//数据数组
			dataList: {
				type: Array,
				default: () => {
					return []
				}
			},
			
			//阈值，必须是负值,因为translateX在默认不动时是0，向左为负，向右为正
			//表示滑动多少px的时候，才会展开和关闭，达不到阈值时，都会执行动画，返回原本的位置
			threshold:{
				type: Number,
				default: -60
			}
		},
		mounted() {
			//添加位移属性。默认为0，position属性是根据其正负值，判断滑动在向左还是向右
			this.dataList.forEach(item => {
				this.$set(item,'slide_x')
				this.$set(item,'position')
				item.slide_x = 0
				item.position=0
			})
			this.list = this.dataList
			this.$forceUpdate()
		},
		methods: {
			getWidth(){
				const query = uni.createSelectorQuery().in(this);
				query.select('#tagBox').boundingClientRect(data => {
					this.max_x = Math.ceil(-data.width);
					if(this.max_x==0){
						this.getWidth()
						console.log('重新获取',this.max_x)
					}
				}).exec();
			},
			touchMove(e, index) {
				//获取最大位移,因为只有在页面显示的时候才能获取，否则组件光是在看不到的页面加载是获取不到宽度的
				if(this.max_x==0){
					this.getWidth()
				}
				//获取移动过程中的点，然后判断总共移动的距离
				let MovePointX = Math.floor(e.changedTouches[0].pageX)
				this.touchList.push(MovePointX)
				let slide = this.touchList[this.touchList.length - 1] - this.touchList[0]
				
				/**
				 * 如果slide为负值，说明是向左移，我们需要做两种判断，是否达到阈值
				 * 是：达到阈值后直接执行动画移动到最左侧，
				 * 否：未达到阈值，则松手后回到之前的位置（注意松手后这一步，需要在touchend中执行），
				 *     此时需要添加动画过渡时间，使其看起来舒服些
				 * 
				 * 后面如果是向右移也是类似的逻辑
				 */
				if (slide <=0) {
					
					if (slide < this.threshold) {
						this.list[index].slide_x = this.max_x
						this.time = 0.3
					} else {
						this.list[index].slide_x = slide
					} 
				} else {
					if (slide > -this.threshold) {
						this.list[index].slide_x = 0
						this.time = 0.3
					} else {
						/**
						 * 此时向右移动时，slide是一个正值，而max_x从一开始的时候我们就赋予了负号，
						 * 一个大数值的赋值和一个逐渐增大的正值，他们的结果要为0（translateX为0 ，回到初始位置），
						 * 所以进行相加的操作
						 */
						// this.list[index].slide_x = -this.max_x + slide
					}
				}
				
				//以上我们在用slide判断是向左还是向右，因为在touchend中也需要判断方向，所以此时将slide赋值给position
				this.list[index].position = slide
			},
			touchEnd(e, index) {
				//判断向左回弹还是向右回弹
				if (this.list[index].position <= 0) {
					if (this.list[index].slide_x > this.threshold) {
						this.list[index].slide_x = 0
						this.time = 0.3
					}
				} else {
					if (this.list[index].slide_x < this.threshold) {
						this.list[index].slide_x = this.max_x
						this.time = 0.3
					}
				}
				this.touchList = []
			},
			clickTag(e,index) {
				this.$emit('change', {item:e,index:index})
				this.list[index].slide_x = 0
				this.time = 0.3
			}
		}
	}
</script>

<style lang="less" scoped>
	.slide {
		width: 100%;
		overflow: hidden;
		.box {
			border-bottom: 2rpx solid #f0f0f0;
			box-sizing: border-box;
			display: flex;
			.slide-content {
				width: 100%;
				min-height: 120rpx;
				background-color: #FFFFFF;
				border-radius: 6rpx;
				display: flex;
				flex-shrink: 0;
			}
		}

		.tagBox {
			display: flex;
			align-items: center;
			.tag {
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 28rpx;
				padding: 0 18rpx;
			}
		}
	}
</style>
