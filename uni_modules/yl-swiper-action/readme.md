# yl-swiper-action

##### <strong style="font-size:14px;">用法示例</strong>
````html
<template>
  <view>
    <yl-swiper-action v-for="(item,index) in list" :key="index" @click="deleteAction(index)">{{item}}</yl-swiper-action>
  </view>
</template>

<script>

export default {
  name: "SwiperActionExample",
  data() {
    return {
      list:[
          'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
        'ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
        'ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd',
        'EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
      ],//循环列表
    }
  },
  onLoad(){

  },
  methods: {
    /**
     * 删除
     * @param index
     */
    deleteAction(index){
      console.log(index)
      this.list.splice(index,1)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
````

##### <strong style="font-size:14px;">Props</strong>

参数	| 说明 |	 类型	| 可选值	| 默认值
:---|:---:|:---|:---:|:---
text|文字|[String] |--|--
background|滑块背景色|String| --|#ff3333
color|文字颜色|String|--|#ffffff
containerStyle|容器样式|Object/String |--|--
textStyle|文字样式|Object/String |--|--
