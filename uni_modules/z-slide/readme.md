# z-slide，滑动操作
 
 ```
<template>
	<view class="content">
		<z-slide :btnList="btnList" :dataList="dataList" :threshold="-20" @change="changeSlide">
			<template v-slot="item">
				{{item.obj.text}}
			</template>
		</z-slide>
	</view>
</template>
 ```
 ##change中的数据是这样的 this.$emit('change', {item:e,index:index})，item表示当前的按钮，index表示datalist中的点击的数据下标
 
 传入的数据渲染之后，可以使用  {{item.obj}} 来获取到数组中的每一项，item是v-slot="item"中的item。
 obj是，内部插槽中绑定数据的属性
 
 
属性           |描述                               |类型
---------------|----------------------------------|
btnList        | `按钮列表`                        |  `Array`
dataList       | `数据列表`                        |  `Array`
threshold      | `滑动触发的阈值（负值）默认-60`     |  `Number`

## 如果你发现自己滑动的时候按钮总是回缩回去，划不动，请看这里
`threshold`：着重说一下阈值，他的目的是 到达一定的位置之后，会直接进行完成操作，
举个栗子：比如滑动操作不超过60px时，松手后，刚才滑动的距离会弹回去，一旦超过60px，会直接进行动画完成最后的移动，

## 如果你发现自己滑动的时候按钮总是回缩回去，滑动不出来，那说明时你的`threshold`参数设置的小了，默认是-60，你可以传参给个-20，或者其他的数值
---

> btnList是一个数组， 应该是这样的，对象中最重要的是`text`属性,这是按钮中显示的文字，
  最好是有id，可以用id来判断不同的按钮，下面的例子中 我用text来判断点击了哪个按钮

> btnList的对象中可以放所有的css3的属性，代码中用了 扩展语法，btnList写的所有的样式都会被实现

```
btnList: [{
			id: 'zxc',
			background: '#e2c7ff',
			text: 'delete',
			color: '#ffffff',
		} ],
```

## 接下来放一个示例
```
<template>
	<view class="content">
		<z-slide :btnList="btnList" :dataList="dataList" :threshold="-20" @change="changeSlide">
			<template v-slot="item">
				{{item.obj.text}}
			</template>
		</z-slide>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
				btnList: [{
						id: 'zxc',
						background: '#6ddcd3',
						text: 'IGNORE',
						color: '#ffffff',
						width: '60px',
						'border-top-left-radius': '3px',
						'border-bottom-left-radius': '3px',
						'white-space': 'nowrap'
					},
					{
						id: 'asd',
						background: '#C35248',
						text: 'DELETE',
						color: '#ffffff',
						width: '90px',
						'white-space': 'nowrap'
					}
				],
				dataList: [{
						id: 1,
						name: 'nakesesi',
						text: 'uniapp自学笔记（一）uniapp：基于vue的全端解决方案 - 简书'
					},
					{
						id: 2,
						name: 'abskesi',
						text: '新建uniapp空模板项目。cli模式。用hbx创建项目在官方教程上讲得比较细致了，我这里只介 …'
					},
					{
						id: 3,
						name: 'cetuiat',
						text: '首先我们要先了解什么是uni-app？ （1） uni-app是一个使用Vue.js语法来开发所有前端应用的框'
					},
					{
						id: 4,
						name: 'feikewarui',
						text: 'uniapp与flutter都是为了解决跨平台问题的框架. uniapp是从h5 app到小程序一步步发'
					},
					{
						id: 5,
						name: 'doubante',
						text: '强大而又符合国内的市场环境的方案，为什么国内一直不火？感… 显示全部'
					},
				]
			}
		},
		methods: {
			changeSlide(e) {
				console.log('你点击了第' + e.index + '数据的' + e.item.text + '按钮')
			}
		}
	}
</script>

<style lang="less" scoped>
	.content{
		/deep/.box {
			margin: 12rpx 0;
			/deep/.slide-content {
				padding-top: 12rpx;
				font-size: 24rpx;
				font-family: ArialMT;
				background-color: #fcffed;
			}
		}
	}

</style>

```
