
倒计时

##### <strong style="font-size:14px;">用法示例</strong>

常规用法：
````html
<template>
    <view class="block">
        <!--    默认用法-->
        <yl-count-down :end-time="endTime"/>
        <!--    自定义背景，文字，倒计时容器样式-->
        <yl-count-down :end-time="endTime" background="#000000" color="#ffffff" text-color="#000000" container-style="margin:20rpx;"/>
        <!--    接收时间字符串-->
        <yl-count-down :end-time="endTimeStr"/>
        <!--    接收时间类型数据-->
        <yl-count-down :end-time="endTimeDate"/>
        <!--    自定义样式,传递对象-->
        <yl-count-down :end-time="endTime"
                       background="transparent"
                       color="#f914f6"
                       text-color="#f914f6"
                       :text-style="{margin:'20rpx','font-size':'40rpx'}"
                       :time-style="{padding:'20rpx','font-size':'40rpx',border:'solid 1px #f914f6'}"
                       :container-style="{margin:'40rpx 20rpx'}"
        />
        <!--    自定义样式，传递字符串-->
        <yl-count-down :end-time="endTime"
                       background="green"
                       color="#ffffff"
                       text-color="#69b90b"
                       text-style="margin:10rpx;font-size:34rpx;"
                       time-style="padding:10rpx;font-size:34rpx;"
        />
    </view>

</template>

<script>
    export default {
        data(){
            return{
                endTime:'',
                endTimeStr:'',
                endTimeDate:null,//
            }
        },
        mounted(){
            this.endTime=new Date().getTime()+100000000
            this.endTimeStr=new Date(this.endTime).toLocaleDateString()
            this.endTimeDate=new Date(this.endTime)
        }
    }
</script> 
````

##### <strong style="font-size:14px;">Props</strong>


参数	| 说明 |	 类型	| 可选值	| 默认值
:---|:---:|:---|:---:|:---
endTime|结束目标时间|[Date,Number,String] |--|--
background|背景|String| --|--
color|颜色|String| --|--
textColor|文字颜色|String|--|--
timeStyle|时间样式|Object / String|--|--
textStyle|时分秒文字样式|Object / String|--|--
containerStyle|容器样式|Object / String|--|--
