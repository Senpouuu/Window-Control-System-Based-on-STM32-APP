<!--短信验证码-->
<template>
  <view class="yl-phone-msg-code">
    <view class="inputbox row-start">
      <text v-if="mobilePrepend" class="mobile-prepend" :style="prependStyle">{{mobilePrepend}}</text>
      <input type="number" :min="0" v-model.trim="msgForm.mobile" :style="mobileInputStyle" placeholder-class="input-placeholder" placeholder="请输入手机号" maxlength="11"/>
    </view>
    <view class="inputbox">
      <input v-model.trim="msgForm.code" placeholder-class="input-placeholder" :style="codeInputStyle" placeholder="请输入短信验证码" @input="$emit('codeChange',msgForm)"/>
      <view  @click="getMsgCode">
        <slot name="getCode" :msgCodeText="msgCodeText">
          <view class="msg-code-text row-center" :style="getCodeBtnStyle">{{msgCodeText}}</view>
        </slot>
      </view>
    </view>
  </view>
</template>

<script>
import {isPhone} from "../../../yl-utils/js_sdk/validate";
import {showAlert,getStyleStr} from "../../../yl-utils/js_sdk/util";

export default {
  props:{
    reqMobileCode:Function,//获取验证码函数
    mobilePrepend:String,//手机号前缀
    mobilePrependStyle:{
      type:[Object,String],
      default:()=>{
        return {}
      }
    },//输入框前置样式
    msgCodeTextConfig:{
      type:Object,
      default:()=>{
        return {
          getCodeText:"",
          reCodeText:"",
        }
      }
    },// 发送按钮文字
    getCodeStyle:{
      type:[Object,String],
      default:""
    },//获取验证码样式
    mobileStyle:{
      type:[Object,String],
      default:()=>{
        return {}
      }
    },//电话输入框样式
    codeStyle:{
      type:[Object,String],
      default:()=>{
        return {}
      }
    },//验证码输入框样式

  },
  data() {
    return {
      msgForm:{},//短信表单
      msgCodeText:this.msgCodeTextConfig.getCodeText || '获取验证码',//短信按钮文字
    }
  },
  computed:{
    prependStyle(){
      const {mobilePrependStyle} = this
      if(typeof mobilePrependStyle==='string'){
        return mobilePrependStyle
      }
      return getStyleStr({...mobilePrependStyle})
    },
    getCodeBtnStyle(){
      const {getCodeStyle} = this
      if(!getCodeStyle){
        return  {
          border:"solid 1px #19b9ce",
          color:"#19b9ce",
          "border-radius": "10rpx",
          width:"170rpx",
          height:"64rpx",
          "font-size": "24rpx",
        }
      }
      if(typeof getCodeStyle==='string'){
        return getCodeStyle
      }
      return getStyleStr({...getCodeStyle})
    },
    mobileInputStyle(){
      const {mobileStyle} = this
      if(typeof mobileStyle==='string'){
        return mobileStyle
      }
      return getStyleStr({...mobileStyle})
    },
    codeInputStyle(){
      const {codeStyle} = this
      if(typeof codeStyle==='string'){
        return codeStyle
      }
      return getStyleStr({...codeStyle})
    }
  },
  methods: {
    /**
     * 获取验证码
     * @returns {Promise<void>}
     */
    async getMsgCode(){
      if(this.hasSend){
        showAlert('操作频繁，请稍后再试！')
        return
      }
      this.$emit('reset')
      let {mobile,code}=this.msgForm
      if(!mobile){
        showAlert('手机号不能为空')
        return
      }
      if(!isPhone(mobile)){
        showAlert('请输入正确手机号')
        return
      }
      this.getCodTime()
      typeof this.reqMobileCode === "function" &&  this.reqMobileCode(mobile,code)
    },
    /**
     * 获取倒计时
     */
    getCodTime(){
      let code=60
      this.msgCodeText=code + ' s'
      this.hasSend=true
      this.codeInterval=setInterval(()=>{
        code--
        this.msgCodeText=code+ ' s'
        if(code<0){
          clearInterval(this.codeInterval)
          this.msgCodeText=this.msgCodeTextConfig.reCodeText || '重新发送'
          this.hasSend=false
        }
      },1000)
    }
  },
  beforeDestroy(){
    clearInterval(this.codeInterval)
  }
}
</script>

<style scoped lang="scss">
.yl-phone-msg-code{
  .inputbox {
    display: flex;
    padding: 20rpx;
    margin:5rpx 50rpx;
    align-items: center;
    border-bottom: 1rpx solid #eeeeee;
    position: relative;
    .mobile-prepend{
      margin-right: 20rpx;
    }
  }
  .inputbox .clearBox{
    width:32rpx;
    height:32rpx;
  }
  .inputbox .clear{
    width:32rpx;
    height:32rpx;
  }
  input {
    flex: 1;
    font-size: 26rpx;
    color:#333333;
  }
  .row-center {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
}

</style>
