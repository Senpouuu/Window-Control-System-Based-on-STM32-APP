<!--
 * @Author: dfh
 * @Date: 2023-01-06 16:41:51
 * @LastEditors: dfh
 * @Modified By: dfh
 * @describe: 侧滑删除
-->
<template>
	<view class="card-wrap" @click="onclick" :style="{
      width: `calc(100% + ${slideWidth}px)`,
      marginLeft: '-' + slideWidth + 'px',
      transform: isTouchMove ? `translateX(0px)` : `translateX(${slideWidth}px)`
    }">
		<slot name="delete"/>
		
		
		<view class="content" @touchstart="touchStartHandle" @touchend="touchEndHande" >
			<slot name="card"/>
		</view>
	</view>
</template>

<script>
	export default {
			props: {
				slideWidth: {
					type: Number,
					default: 0
				}
			},
			data() {
				return {
					touchStartX: "",
					isTouchMove: false, //向左滑动：true,显示删除按钮
					screenWidth: 0
				};
			},
			created() {
				const {
					screenWidth
				} = uni.getSystemInfoSync();
				this.screenWidth = screenWidth;
				
				uni.$on("slide-close", () => {
					
					this.isTouchMove = false;
				});
			},
	
			methods: {
				touchStartHandle(e) {
					this.touchStartX = e.changedTouches[0].clientX;
				},
				
				onclick(){
					this.isTouchMove = false;
				},
				
				touchEndHande(e) {
					const touchStartX = this.touchStartX;
					const touchEndX = e.changedTouches[0].clientX;
					//向左滑动touchEndX < touchStartX
					if (touchStartX - touchEndX > 80) {
						
						this.isTouchMove = true;
					} else {
						this.isTouchMove = false;
					}
				},
			}
		};
	
</script>

<style lang="css" scoped>
	.card-wrap {
		margin-top: 24rpx;
		position: relative;
		box-sizing: border-box;
		transition: all 0.3s;
	}

	.content {
		position: relative;
		width: 100%;
	}

	/* 左移动 */
	.move-left {
		transform: translateX(0rpx);
	}
</style>
