# 最简洁的模拟图片预览,支持长按事件  支持vue2/vue3/app/小程序/h5

  - 为了解决项目中因一些特殊原因无法使用uni.previewImage
  - 比如一些项目在App.onShow中写了方法，如果用uni.previewImage，每次预览图片都会进到App.onShow里
  - 如没有特殊原因，还是推荐官方的uni.previewImage

## 安装指引

1. 在插件市场打开本插件页面，在右侧点击`使用 HBuilderX 导入插件`，选择要导入的项目点击确定

2. 使用方法 vue2写法

```
<template>
	<view>
		<image v-for="(item, index) in imgs" :key="index" :src="item" @click="preview(item)"></image>
		<q-previewImage ref="previewImage" :urls="imgs" @onLongpress="onLongpress"></q-previewImage>
	</view>
</template>

<script>
export default {
 	data() {
 		return {
 			imgs: ['https://web-assets.dcloud.net.cn/unidoc/zh/multiport-20210812.png', 'https://web-assets.dcloud.net.cn/unidoc/zh/uni-function-diagram.png'],
 		};
 	},

 	methods: {
 		preview(url) {
			this.$nextTick(()=>{ 
				this.$refs.previewImage.open(url); // 传入当前选中的图片地址
			})
 		},
		onLongpress(e){ //长按事件
			console.log('当前长按的图片是' + e);
			uni.showActionSheet({
				itemList: ['转发给朋友', '保存到手机'],
				success: function (res) {
					console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
				},
				fail: function (res) {
					console.log(res.errMsg);
				}
			});
		}
 	}
 };
</script>


```

3. vue3 setup写法

```

<template>
	<view>
		<image v-for="(item, index) in imgs" :key="index" :src="item" @click="preview(item)"></image>
		<q-previewImage ref="previewImage" :urls="imgs"  @onLongpress="onLongpress"></q-previewImage>
	</view>
</template>

<script setup>
import { reactive, ref, toRefs, nextTick } from 'vue';

const data = reactive({
	imgs: ['https://web-assets.dcloud.net.cn/unidoc/zh/multiport-20210812.png', 'https://web-assets.dcloud.net.cn/unidoc/zh/uni-function-diagram.png'],
});
const previewImage = ref(null);

const { imgs } = toRefs(data)// 解构

const preview = url => {
	nextTick(()=>{
		previewImage.value.open(url); // 传入当前选中的图片地址
	})
	

};

const onLongpress = e =>{
	console.log('当前长按的图片是' + e);
	uni.showActionSheet({
		itemList: ['转发给朋友', '保存到手机'],
		success: function (res) {
			console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
		},
		fail: function (res) {
			console.log(res.errMsg);
		}
	});
}
</script>
					
```

4. 项目示例 (一般返回的图片是以逗号或特殊字符分割的字符串，点击时就需要传两个参数，一个是图片数组，一个是当前图片的index)

```
<template>
	<view>
		<view v-for="(item, index) in list" :key="index" class="list">
			<image :src="i"  mode="aspectFill" v-for="(i,imgindex) in item.urls.split(',')" @click.stop="preimg(item.urls.split(','),imgindex)"></image>
			<q-previewImage ref="previewImage" :urls="imgs" @onLongpress="onLongpress"></q-previewImage>
		<view>
	</view>
</template>

<script>
export default {
 	data() {
 		return {
 			imgs: ['https://web-assets.dcloud.net.cn/unidoc/zh/multiport-20210812.png', 'https://web-assets.dcloud.net.cn/unidoc/zh/uni-function-diagram.png'],
 		};
 	},

 	methods: {
 		preimg(urls,index){
 			this.imgs = urls
 			this.$nextTick(()=>{
 				this.$refs.previewImage.open(this.imgs[index]); // 传入当前选中的图片地址
 			})
 		},
		onLongpress(e){ //长按事件
			console.log('当前长按的图片是' + e);
			uni.showActionSheet({
				itemList: ['转发给朋友', '保存到手机'],
				success: function (res) {
					console.log('选中了第' + (res.tapIndex + 1) + '个按钮');
				},
				fail: function (res) {
					console.log(res.errMsg);
				}
			});
		}
 	}
 };
</script>

```


## 如果插件对您有一点帮助，请给个五星好评，感谢支持


## 如有问题，请加qq 965969604