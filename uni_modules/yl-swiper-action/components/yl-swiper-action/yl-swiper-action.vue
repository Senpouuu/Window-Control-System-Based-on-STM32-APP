<template>
  <view class="yl-swiper-action"
        :style="blockStyle"
        @touchmove="handletouchmove"
        @touchstart="handletouchstart"
        @click="clickContainer"
  >
    <slot></slot>
    <view class="yl-action" :style="textStrStyle" @click.stop="click">{{ text }}</view>
  </view>
</template>
<script>
import {getStyleStr} from "../../../yl-utils/js_sdk/util";
export default {
  props:{
    text:{
      type:String,
      default:'删除'
    },//文字
    background:{
      type:String,
      default:'#ff3333'
    },//滑块背景色
    color:{
      type:String,
      default:'#ffffff'
    },//文字颜色
    textStyle:{
      type:[Object,String],
      default:()=>{
        return {}
      }
    },//文字样式
    containerStyle:{
      type:[Object,String],
      default:()=>{
        return {}
      }
    },//容器样式
  },
  computed:{
    textStrStyle(){
      const {delRight,background,color,textStyle} = this
      if(typeof textStyle==='string'){
        return `color:${color};background:${background};right:${delRight};${textStyle}`
      }
      return getStyleStr({background,color,right:delRight,...textStyle})
    },
    blockStyle(){
      const {containerStyle} = this
      if(typeof containerStyle==='string'){
        return containerStyle
      }
      return getStyleStr({...containerStyle})
    }
  },
  data(){
    return{
      touchStartX:0,//
      startAnimation:0,//
      delRight:'-100rpx'
    }
  },
  methods:{
    /**
     * 滑动开始
     * @param event
     */
    handletouchstart: function(event) {
      this.touchStartX= event.touches[0].pageX
    },
    /**
     * 滑动中
     * @param event
     */
    handletouchmove: function(event) {
      let currentX = event.touches[0].pageX
      let touchStartX=this.touchStartX
      if(touchStartX<currentX){
        //向右滑动
        if(this.startAnimation===0){
          return
        }
        if(currentX-touchStartX>50){
          this.startAnimation=0
          this.delRight='-100rpx'
        }
      }else{
        //向左滑动
        if(this.startAnimation===1){
          return
        }
        if(touchStartX-currentX>50){
          this.startAnimation=1
          this.delRight=0
        }
      }
    },
    /**
     * 点击
     */
    click(){
      this.$emit('click')
      this.startAnimation=0
      this.delRight='-100rpx'
    },
    /**
     * 点击容器
     */
    clickContainer(){
      this.startAnimation=0
      this.delRight='-100rpx'
    },
    /**
     * 获取样式
     */
    getStyleStr(styles){
      let styleStr=''
      for(let i in styles){
        styleStr+=`${i}:${styles[i]};`
      }
      return styleStr
    },
  }
}
</script>
<style>
.yl-swiper-action{
  background: #ffffff;
  margin-bottom: 30rpx;
  box-shadow: 0 1rpx 4rpx #cccccc;
  border-radius: 10rpx;
  position: relative;
  padding-top:20rpx;
  overflow: hidden;
  border:solid 1px transparent;
}
.yl-action{
  position: absolute;
  right:-100rpx;
  top:0;
  width:100rpx;
  height:100%;
  font-size: 32rpx;
  transition: all 0.5s ease;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
