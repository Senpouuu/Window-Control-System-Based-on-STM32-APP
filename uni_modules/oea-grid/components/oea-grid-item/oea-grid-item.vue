<template>
	<view v-if="width" :style="'width:'+width+';'+(square?'height:'+width:'')" class="oea-grid-item">
		<view :class="{ 'oea-grid-item--border': showBorder,  'oea-grid-item--border-top': showBorder && index < column, 'uni-highlight': highlight }"
		 :style="{'border-right-color': borderColor ,'border-bottom-color': borderColor ,'border-top-color': borderColor }"
		 class="oea-grid-item__box">
			<view v-if="square" class="oea-tools-item" :class="{'tools-shadow': shadow, 'uni-highlight': highlight}" :style="[{
			  borderRadius: radius + 'px',
			  margin: margin + 'px',
			  backgroundColor: bgColor,
			}]" @click="_onClick">
        <slot />
      </view>
      <slot v-else></slot>
		</view>
	</view>
</template>

<script>
	/**
	 * GridItem 宫格
	 * @description 宫格组件
	 * @property {Number} index 子组件的唯一标识 ，点击gird会返回当前的标识
	 */
	export default {
		name: 'oea-grid-item',
		inject: ['grid'],
		props: {
			index: {
				type: Number,
				default: 0
			},
      radius: {
        type: Number,
        default: 10
      },
      margin: {
        type: Number,
        default: 8
      },
      bgColor: {
        type: String,
        default: '#FFFFFF'
      },
      shadow: {
        type: Boolean,
        default: true
      }
		},
		data() {
			return {
				column: 0,
				showBorder: true,
				square: true,
				highlight: true,
				left: 0,
				top: 0,
				openNum: 2,
				width: 0,
				borderColor: '#e5e5e5'
			}
		},
		created() {
			this.column = this.grid.column
			this.showBorder = this.grid.showBorder
			this.square = this.grid.square
			this.highlight = this.grid.highlight
			this.top = this.hor === 0 ? this.grid.hor : this.hor
			this.left = this.ver === 0 ? this.grid.ver : this.ver
			this.borderColor = this.grid.borderColor
			this.grid.children.push(this)
			// this.grid.init()
			this.width = this.grid.width
		},
		beforeDestroy() {
			this.grid.children.forEach((item, index) => {
				if (item === this) {
					this.grid.children.splice(index, 1)
				}
			})
		},
		methods: {
			_onClick() {
				this.grid.change({
					detail: {
						index: this.index
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.oea-grid-item {
		/* #ifndef APP-NVUE */
		height: 100%;
		display: flex;
		/* #endif */
		/* #ifdef H5 */
		cursor: pointer;
		/* #endif */
	}

	.oea-grid-item__box {
		/* #ifndef APP-NVUE */
		display: flex;
		width: 100%;
		/* #endif */
		position: relative;
		flex: 1;
		flex-direction: column;
		// justify-content: center;
		// align-items: center;
	}

	.oea-grid-item--border {
		position: relative;
		/* #ifdef APP-NVUE */
		border-bottom-color: #D2D2D2;
		border-bottom-style: solid;
		border-bottom-width: 0.5px;
		border-right-color: #D2D2D2;
		border-right-style: solid;
		border-right-width: 0.5px;
		/* #endif */
		/* #ifndef APP-NVUE */
		z-index: 0;
		border-bottom: 1px #D2D2D2 solid;
		border-right: 1px #D2D2D2 solid;
		/* #endif */
	}
	.oea-grid-item--border-top {
		position: relative;
		/* #ifdef APP-NVUE */
		border-top-color: #D2D2D2;
		border-top-style: solid;
		border-top-width: 0.5px;
		/* #endif */
		/* #ifndef APP-NVUE */
		border-top: 1px #D2D2D2 solid;
		z-index: 0;
		/* #endif */
	}


	.uni-highlight:active {
		background-color: #f1f1f1 !important;;
	}
  
  .oea-tools-item {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .tools-shadow {
    box-shadow: 0 0 15rpx #8f8f94; //投影.
	
  }
  
</style>
