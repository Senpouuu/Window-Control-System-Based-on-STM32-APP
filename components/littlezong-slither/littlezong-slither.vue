<template>
	<view class="zuni_slither_item"
		  :style="calcTransformX">
		<view class="zuni_slither_item_content"
			  @touchstart="handleTouchStart"
			  @touchmove="handleTouchMove"
			  @touchend="handleTouchEnd">
			<slot></slot>
		</view>
		<view class="zuni_slither_item_actions" :style="{right: calcActionsPositionRight}">
			<view class="zuni_slither_item_action" 
				  v-for="(action, index) in actions" 
				  :style="{width: calcActionStyle(action.style).width, color: calcActionStyle(action.style).color, background: calcActionStyle(action.style).background, opacity: calcOpacity}"
				  @click="triggerAction(index)"
				  :key="index"> 
				<text class="zuni_slither_item_action_text">
					{{action.title}}
				</text>
			</view>
		</view>
	</view>
</template>

<script>
	import './littlezong-slither.less'
	// 用于索引当前操作项
	let SLITHER_INDEX = 0
	export default{
		name: 'Slither',
		props: {
			// 滑动后显示的行为
			actions: {
				type: Array,
				default(){
					return [{
						title: '操作',
						style: {},
						trigger(index){
							console.log(index)
						}
					}]
				}
			},
			// 通过该值索引到列表对应项
			activeIndex: {
				required: true,
				default: null
			},
			// 淡入
			fade: {
				type: Boolean,
				default: false
			},
			// 禁止滑动
			disabled: {
				type: Boolean,
				default: false
			}
		},
		data(){
			return {
				activeStatus: this.activeIndex,
				start: {
					x: 0,
					y: 0
				},
				end: {
					x: 0,
					y: 0
				},
				touchTarget: {
					isClick: false,
					isMoving: false,
					previousX: 0,
					offsetX: 0,
					index: null,
					// 最大滑动距离
					maxToSlide: 100
				}
			}
		},
		computed: {
			calcOpacity(){
				if(!this.fade) return 1
				return this.touchTarget.isMoving || this.activeStatus !== null && this.activeIndex === this.touchTarget.index && !this.touchTarget.isClick ? 1 : 0
			},
			/**
			 * 计算横向滑动距离
			 */
			calcTransformX(){
				if(this.touchTarget.index !== this.activeIndex){
					return 'transform: translate3d(0, 0, 0)'
				}else{
					return `transform: translate3d(${this.touchTarget.offsetX}px, 0, 0)`
				}
			},
			/**
			 * 计算right
			 */
			calcActionsPositionRight(){
				const right = this.actions.map(action => parseFloat(this.calcActionStyle(action.style).width)).reduce((total, width) => total + width) * -1
				return `${right}px`
			}
		},
		methods: {
			/**
			 * 滑动后模拟点击
			 * 解决在小程序端点击无效
			 */
			handleClick(e){
				// console.log('click', e)
				const activeStatus = this.activeStatus !== null
				this.$emit('click', {
					event: e,
					activeStatus,
					index: this.touchTarget.index
				})
				this.$nextTick(() => this.activeStatus = this.activeIndex)
			},
			handleTouchStart(e){
				this.activeStatus = this.activeIndex
				if(!this.disabled){
					this.start = {
						x: e.touches[0].clientX,
						y: e.touches[0].clientY
					}
					this.touchTarget.isClick = true
					this.touchTarget.previousX = e.touches[0].clientX
					this.touchTarget.offsetX = 0
					this.$emit('update:activeIndex', this.touchTarget.index)
				}
			},
			handleTouchMove(e){
				if(!this.disabled){
					let currentX = e.touches[0].clientX
					let currentY = e.touches[0].clientY
					let isDirectionX = Math.abs(currentY - this.start.y) <= Math.abs(currentX - this.start.x)
					
					this.touchTarget.isClick = false
					
					// 纵向滑动小于横向滑动时
					// true => 横向允许滚动，纵向禁止滚动
					if(isDirectionX){
						e.preventDefault()
						this.touchTarget.isMoving = true
						let diffX = currentX - this.touchTarget.previousX
						const offsetX = this.touchTarget.offsetX + diffX
						// console.log(diffX, offsetX)
						// 右滑
						if(diffX >= 0){
							this.touchTarget.offsetX = Math.min(0, offsetX)
						}else{
							this.touchTarget.offsetX = Math.max(this.touchTarget.maxToSlide, offsetX)
						}
						// 存储上次滑动
						this.touchTarget.previousX = currentX
					}
				}
			},
			handleTouchEnd(e){
				const isReached = Math.abs(this.touchTarget.offsetX) < Math.abs(this.touchTarget.maxToSlide) / 3
				if(isReached){
					this.touchTarget.offsetX = 0
					this.$emit('update:activeIndex', null)
				}else{
					this.touchTarget.offsetX = this.touchTarget.maxToSlide
					this.activeStatus = this.activeIndex
					this.$emit('slide-out', this.touchTarget.index)
				}
				this.touchTarget.isMoving = false
				// 如果没拖动则为点击事件
				if(this.touchTarget.isClick){
					this.handleClick(e)
				}
			},
			
			/**
			 * 自定义事件触发
			 */
			triggerAction(index){
				this.actions[index] && this.actions[index].trigger(this.touchTarget.index)
			},
			/**
			 * 行为样式
			 */
			calcActionStyle(styleOptions){
				const actionStyle = Object.assign({
					width: 180,
					opacity: 0,
					color: '#fff',
					background: '#D65649'
				}, styleOptions)
				// 转为px单位
				actionStyle.width = uni.upx2px(actionStyle.width) + 'px'
				return actionStyle
			}
		},
		mounted(){
			this.touchTarget.index = SLITHER_INDEX
			SLITHER_INDEX++
			this.touchTarget.maxToSlide = parseFloat(this.calcActionsPositionRight)
		},
		watch: {
			/**
			 * 通过监听索引关闭其他滑动项
			 */
			activeIndex(){
				if(this.touchTarget.index !== this.activeIndex){
					this.touchTarget.offsetX = 0
				}
			}
		}
	}
</script>
