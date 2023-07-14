# o-empty 暂无数据 缺省页 空白数据 占位提示组件

## 描述
Empty 简单易用 暂无数据 缺省页 空白数据 占位提示组件

## 使用方法
```html
<template>
	<view>
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
		<o-empty img="https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/gh_33446d7f7a26_430.jpg" 
                 imgSize="180" text="小程序需绝对路径" />
		<!-- #endif -->
        
	</view>
</template>

<style lang="scss">
	.title{
		padding: 20rpx 0 10rpx 20rpx;
	}
</style>
```



## API

#### oEmpty Props

| 属性名    | 类型   | 默认值  | 可选值 | 说明                                 |
| --------- | ------ | ------- | ----------------------------------- | ----------------------------------- |
| img       | String | -   | network、search、error | 缺省图片，支持传入图片URL（支持jpg、png、svg格式） |
| imgSize | String | 320rpx |         | 缺省图片大小，单位rpx |
| text      | String | 暂无数据 |         | 缺省图下方描述文字             |
| bg        | String | #fff |  | 组件背景，style模式                    |





