<template>
	<view class="h100">
		<view class="title">基本用法</view>
		<o-empty />
		<view class="title">自定义背景色</view>
		<o-empty img="error" bg="#f6f7f8" text="内容整理中.." />
		<view class="title">自定义大小</view>
		<o-empty img="search"  text="无搜索记录" imgSize="200" />
		<view class="title">自定义插槽内容</view>
		<o-empty img="network" text="网络中断" >
			<button type="primary" size="mini">自定义按钮</button>
		</o-empty>
		<view class="title">自定义图片</view>
		<!-- #ifndef MP -->
		<o-empty img="../../static/icon.png" imgSize="180" text="自定义图片" />
		<!-- #endif -->
		<!-- #ifdef MP -->
		<o-empty img="https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/gh_33446d7f7a26_430.jpg" imgSize="180" text="小程序需绝对路径" />
		<!-- #endif -->
	</view>
</template>

<style lang="scss">
	.h100{
		height:100vh;
	}
	.title{
		padding: 20rpx 0 10rpx 20rpx;
	}
</style>
