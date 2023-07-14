<template>
	<view class="previewImage" v-if="show" @tap="close">
		<view class="page" v-if="urls.length > 0">
			<text class="text">{{ current + 1 }} / {{ urls.length }}</text>
		</view>
		<swiper class="swiper" :current="current" @change="swiperChange">
			<swiper-item v-for="(item, index) in urls" :key="index">
				<scroll-view scroll-y="true" class="uni-scroll-view">
					<view class="scroll-view"><image :key="index" class="image" :src="item" mode="widthFix" @longpress="onLongpress(item)"/></view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
export default {
	props: {
		urls: {
			type: Array,
			required: true,
			default: () => {
				return [];
			}
		}
	},
	data() {
		return {
			show: false, 
			current: 0 //当前页
		};
	},
	methods: {
		//打开
		open(current) {
			this.current = this.urls.findIndex(item => item === current);
			this.show = true;
		},
		//关闭
		close() {
			this.show = false;
			this.current = 0;
		},
		//图片改变
		swiperChange(e) {
			this.current = e.detail.current;
		},
		//监听长按
		onLongpress(e){
			this.$emit('onLongpress',e)
		}
	}
};
</script>

<style lang="scss" scoped>
.previewImage {
	z-index: 9999;
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: #000000;
	.swiper {
		width: 100%;
		height: 100vh;
		swiper-item {
			.scroll-view {
				display: flex;
				align-items: center;
				justify-content: center;
				height: 100vh;
				.image {
					width: 100%;
					height: auto;
				}
			}
		}
	}
	.page {
		position: absolute;
		z-index: 9999;
		width: 100%;
		top: 60rpx;
		text-align: center;
		.text {
			color: #fff;
			font-size: 32rpx;
			background-color: rgba(0, 0, 0, 0.5);
			padding: 3rpx 16rpx;
			border-radius: 20rpx;
			user-select: none;
		}
	}
	
}

</style>
