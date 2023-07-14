
获取手机验证码

##### <strong style="font-size:14px;">用法示例</strong>

常规用法：
````html
<template>
    <view>
        <!--    默认用法-->
        <yl-phone-msg-code
                :req-mobile-code="getCode"
        />
        <!--    电话输入框前缀-->
        <yl-phone-msg-code
                mobile-prepend="+86"
                :req-mobile-code="getCode"
        />
        <!--    自定义样式及自定义按钮-->
        <view  style="background: #13141a;padding:20rpx 0;">
            <yl-phone-msg-code
                    mobile-prepend="+86"
                    :req-mobile-code="getCode"
                    :mobile-style="customStyle"
                    :mobile-prepend-style="customStyle"
                    :codeStyle="customStyle"
                    @codeChange="codeChange"
            >
                <template #getCode="{msgCodeText}">
                    <view class="getCode">
                        <view class="getCodeInner">{{ msgCodeText }}</view>
                    </view>
                </template>
            </yl-phone-msg-code>
        </view>


    </view>
</template>

<script>
    import {reqMobileCode} from "../api/common";

    export default {
        name: "PhoneMsgCodeExample",
        data() {
            return {
                customStyle:{
                    color:"#ffffff"
                },// 自定义样式
            }
        },
        mounted() {
        },
        methods: {
            /**
             * 获取验证码
             * @param mobile
             * @param code
             * @returns {Promise<void>}
             */
            async getCode(mobile,code){
                let result = await reqMobileCode(mobile)
                console.log(result)
            },
            /**
             * 验证码改变
             * @param code
             */
            codeChange(code){
                console.log(code)
            }

        }
    }
</script>

<style lang="scss" scoped>
    .getCode{
        width: 160rpx;
        background: linear-gradient(90deg,#f6b847, #f1950e);
        padding:2rpx;
    .getCodeInner{
        font-size: 20rpx;
        text-align: center;
        color: #faad14;
        background: #13141a;
        padding:10rpx 20rpx;
    }
    }
</style>

````

##### <strong style="font-size:14px;">Props</strong>

参数	| 说明 |	 类型	| 可选值	| 默认值
:---|:---:|:---|:---:|:---
reqMobileCode|获取验证码函数|[Function] |--|--
mobilePrepend|手机号前缀|String| --|--
mobilePrependStyle|输入框前置样式|Object / String|--|--
msgCodeTextConfig|发送按钮文字|Object |--|--
getCodeStyle|获取验证码样式|Object / String|--|--
mobileStyle|电话输入框样式|Object / String|--|--
codeStyle|验证码输入框样式|Object / String|--|--
