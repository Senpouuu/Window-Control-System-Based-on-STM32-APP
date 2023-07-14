<!--倒计时-->
<template>
  <view class="yl-count-down-box" :style="blockStyle">
    <view class="time-block" :style="timeBlockStyle" v-if="date && date!=='00'">{{date}}</view>
    <view class="time-text" :style="textStrStyle" v-if="date && date!=='00'">天</view>
    <view class="time-block" :style="timeBlockStyle" v-if="hour && hour!=='00'">{{hour}}</view>
    <view class="time-text" :style="textStrStyle" v-if="hour && hour!=='00'">时</view>
    <view class="time-block" :style="timeBlockStyle" v-if="minute && minute!=='00'">{{minute}}</view>
    <view class="time-text" :style="textStrStyle" v-if="minute && minute!=='00'">分</view>
    <view class="time-block" :style="timeBlockStyle">{{second}}</view>
    <view class="time-text" :style="textStrStyle">秒</view>
  </view>
</template>

<script>
import {getStyleStr} from "../../../yl-utils/js_sdk/util";
export default {
  props:{
    endTime:[Date,Number,String],//结束时间
    background:String,//背景
    color:String,//颜色
    textColor:String,//文字颜色
    timeStyle:{
      type:[Object,String],
      default:()=>{
        return {}
      }
    },//时间样式
    textStyle:{
      type:[Object,String],
      default:()=>{
        return {}
      }
    },//时分秒样式
    containerStyle:{
      type:[Object,String],
      default:()=>{
        return {}
      }
    },//容器样式
  },
  data(){
    return{
      date:'',//天
      hour:'',//时
      minute:'',//分
      second:'',//秒
      spaceTime:0,//间隔时间
      timeOut:null,//定时器
    }
  },
  computed:{
    timeBlockStyle(){
      const {background,color,timeStyle} = this
      if(typeof timeStyle==='string'){
        return `background:${background};color:${color};${timeStyle}`
      }
      return getStyleStr({background,color,...timeStyle})
    },
    textStrStyle(){
      const {textColor,textStyle} = this
      if(typeof textStyle==='string'){
        return `color:${textColor};${textStyle}`
      }
      return getStyleStr({color:textColor,...textStyle})
    },
    blockStyle(){
      const {containerStyle} = this
      if(typeof containerStyle==='string'){
        return containerStyle
      }
      return getStyleStr({...containerStyle})
    }
  },
  watch:{
    endTime:{
      handler:function(value){
        clearTimeout(this.timeOut)
        value && this.startCount(value)
      },
      immediate: true
    }
  },
  methods:{
    /**
     * 开始倒计时
     */
    startCount(value){
      if(typeof value === "string"){
        value = value.replace(/-/g,"/")
      }
      let time = new Date(value)
      let now=Date.now()
      this.spaceTime=time-now
      this.getTimeData(this.spaceTime)
      this.timeOutCount()
    },
    /**
     * 获取倒计时时间
     */
    getTimeData(time){
      let date = Math.floor(time/(1000*60*60*24))  //计算天数
      let hour = Math.floor(time/(1000*60*60)%24)  //计算小时数
      let minute = Math.floor(time/(1000*60)%60)  //计算分钟数
      let second = Math.floor(time/1000%60) //计算秒数
      date<0 && (date=0)
      hour<0 && (hour=0)
      minute<0 && (minute=0)
      second<0 && (second=0)
      ;date<10 && (date='0'+date)
      ;hour<10 && (hour='0'+hour)
      ;minute<10 && (minute='0'+minute)
      ;second<10 && (second='0'+second)
      this.date=date
      this.hour=hour
      this.minute=minute
      this.second=second
    },
    /**
     * 倒计时
     */
    timeOutCount(){
      this.timeOut=setTimeout(()=>{
        this.spaceTime=this.spaceTime-1000
        if(this.spaceTime<0){
          return
        }
        this.getTimeData(this.spaceTime)
        this.timeOutCount(this.spaceTime)
      },1000)
    }
  }
}
</script>

<style scoped lang="scss">
.yl-count-down-box{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  .time-block{
    background: #FFFFFF;
    border-radius: 6rpx;
    padding:0 10rpx;
  }
  .time-text{
    font-size: 20rpx;
    margin:0 10rpx;
  }
}
</style>
