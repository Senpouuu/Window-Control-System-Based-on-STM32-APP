<template>
  <view v-if="!custom">
    <view class="oea-gd-weather" :class="card?'oea-weather-card oea-weather-card_radius':''">
      <view class="oea-gd-weather__c" :class="card?'oea-weather-card_radius':''">

        <view class="oea-gd-weather__c_head">
          <view class="oea-gd-weather__c_head_citySwitch">
            <view class="oea-gd-weather__c_head_citySwitch_icon xy_center" @click="citySwitchBtn">
              <oea-icon type="icofont" :name="citySwitch_icon"></oea-icon>
            </view>
          </view>
          <view class="oea-gd-weather__c_head_title">
            <!-- {{province}} - {{city}} -->
            {{city}}
          </view>
          <view class="oea-gd-weather__c_head_update">
            <view class="oea-gd-weather__c_head_update_icon xy_center" @click="updateBtn()">
              <oea-icon type="icofont" :name="update_icon"></oea-icon>
            </view>
          </view>
        </view>
        
        <view class="xy_center" style="font-size: 55px;">
          {{today.weather}}
        </view>
        
        <oea-separate top="25px"></oea-separate>
        
        <oea-grid style="color: #696969;" :column="4" :square="true" :highlight="false">
          <oea-grid-item v-for="(name, index) in today.data[0]" :key="index">
            <view>
              <view class="xy_center" style="font-weight: bold; font-size: 35rpx;">
                {{name}}
              </view>
              <view class="xy_center">
                <view v-if="index!=3">{{today.data[1][index]}}</view>
                <view v-if="index==3">
                  <view v-if="today.data[1][index]=='≤3'">{{today.data[1][index]}}</view>
                  <oea-icon v-else type="icofont" :name="windScaleToIcon(today.data[1][index])" size="21px"></oea-icon>
                </view>
                <oea-icon v-if="index==0" type="icofont" name="celsius"></oea-icon>
                <view v-if="index==1">%</view>
                <!-- <view v-if="index==2">风</view> -->
                <!-- <view v-if="index==3">级</view> -->
              </view>
            </view>
          </oea-grid-item>
          
        </oea-grid>
        
        <oea-separate top="20px"></oea-separate>
        
       
        

        <view v-if="reporttime" style="font-size: 15px;display: flex;justify-content: center;margin-top: 20px;position: absolute;bottom: 0;right: 0;left: 0;color: #696969;">{{'更新于: '+reporttime}}</view>
      </view>
    </view>
    <view>
      <uni-popup ref="popup">
        <uni-popup-dialog title=" ">
          <uni-data-picker :localdata="data" popup-title="请选择" v-model="city_adcode"></uni-data-picker>
        </uni-popup-dialog>
      </uni-popup>
    </view>
  </view>
  <view v-else><slot/></view>
</template>

<script>

/**
 * @name oea-weather
 * @description 利用 高德API 接口 实现的 自动IP定位到城市, 并查询当前的天气, 以及预报天气
 * 
 * @property {Boolean} debug 打开 输出 内容到控制台
 * @property {String} title 标题, 没用
 * @property {Boolean} card 卡片模式 默认为 true
 * @property {String} ip 外部输入 IP地址
 * @property {String} default_adcode 默认城市编码
 * @property {String} adcode 城市编码
 * @property {String} gd_weather_api_url 高德天气 api接口
 * @property {String} gd_ip_api_url 高德IP定位 api接口
 * @property {String} gd_key 获取地址：https://console.amap.com/dev/key/app
 * @property {String} citySwitch_icon 切换城市 的按钮的 形状
 * @property {String} update_icon 更新天气 的按钮的 形状
 * 
 */
import cityData from './city.data.js'

export default {
  name: 'oea-weather',
  data() {
    return {
      data: cityData,
      city_adcode: this.adcode,
      province: '',
      city: '',
      reporttime: '', // 更新时间
      
      today: {
        data: [['温度', '湿度', '风向', '风力'], []],
      },
      today_weather: null,
      casts: [null, null, null, null],
    }
  },
  props: {
    // 用于测试 输出调试 信息
    debug: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '高德天气API接口'
    },
    custom: {
      type: Boolean,
      default: false
    },
    card: {
      type: Boolean,
      default: true
    },
    ip: {
      type: String,
      default: 'auto'
    },
    default_adcode: {
      type: String,
      default: ''
    },
    adcode: {
      type: String,
      default: ''
    },
    // 高德 API 接口
    gd_weather_api_url: {
      type: String,
      default: 'https://restapi.amap.com/v3/weather/weatherInfo'
    },
    gd_ip_api_url: {
      type: String,
      default: 'https://restapi.amap.com/v3/ip'
    },
    gd_key: {
      type: String,
      default: ''
    },
    // icon
    citySwitch_icon: {
      type: String,
      default: 'ui-reply'
    },
    update_icon: {
      type: String,
      default: 'ui-rotation'
    }
  },
  watch: {
    city_adcode() {
      this.all_update()
    },
    casts() {
      this.$emit('forecasts', this.casts)
    },
    today_weather() {
      this.$emit('todayWeather', this.today_weather)
    }
  },
  emits: ['forecasts', 'todayWeather', 'citySwitch'],
  mounted() {
    if (this.city_adcode != '') this.all_update()
    this.ipToAdcode()
  },
  
  onShow() {
  	let that = this
  	setInterval(function() {
  		this.all_update()
  	}, 1000);
  	
  },
  methods: {
    log(e) {
      console.log(e)
    },
    adcodeChange(adcode) {
      this.city_adcode = adcode
    },
    citySwitchBtn() {
      this.$refs.popup.open('center')
      this.$emit('citySwitch')
    },
    updateBtn() {
      this.all_update()
      this.showToast('刷新成功')
    },
    all_update() {
      if (!this.city_adcode) this.ipToAdcode()
      this.update('base')
      this.update('all')
    },
    windScaleToIcon(wind_scale) {
      if (wind_scale != '≤3') {
        return 'wind-scale-' + wind_scale
      } else {
        return 'wind-waves'
      }
    },
    nToN(n) {
      let r;
      switch(n) {
        case '1': r='一';break;
        case '2': r='二';break;
        case '3': r='三';break;
        case '4': r='四';break;
        case '5': r='五';break;
        case '6': r='六';break;
        case '7': r='日';break;
      }
      return r
    },
    ipToAdcode() {
      // 1 check
      if (this.default_adcode != '' && this.city_adcode == '') this.city_adcode = this.default_adcode
      if (this.city_adcode != '') return
      if (!this.check('key')) return
      // 2
      let data = {}
      data.key = this.gd_key
      if (this.ip != '127.0.0.1' && this.ip != '' && this.ip != 'auto') data.ip = this.ip
      
      if (this.debug) console.log({
        name: 'uni.request',
        data: data
      })
      uni.request({
        url: this.gd_ip_api_url,
        data: data,
        success: (e) => {
          // 1
          if (this.debug) console.log(e.data)
          if (!this.check('obj', e.data)) {
            this.showToast('请检查url接口是否正确')
            return
          }
          if (this.check('state', e.data)) {
            if (this.check('adcode', e.data)) {
              // 2
              this.city_adcode = e.data.adcode
            } else {
              this.city_adcode = '110000'
            }
          }
        },
        fail: (e) => {
          this.showToast('网络问题')
          console.log(e)
        }
      })
    },
    update(extensions) {
      if (this.debug) console.log({
        key: this.gd_key,
        city: this.city_adcode,
        extensions: extensions,
        output: 'JSON'
      })
      if (!this.check('key')) return
      uni.request({
        url: this.gd_weather_api_url,
        data: {
          key: this.gd_key,
          city: this.city_adcode,
          extensions: extensions,
          output: 'JSON'
        },
        success: (e) => {
          // 1
          if (this.debug) console.log(e.data)
          if (!this.check('obj', e.data)) {
            this.showToast('请检查url接口是否正确')
            return
          }
          if (!this.check('state', e.data)) return
          // 2
          if (extensions == 'base') {
            this.today_weather = e.data.lives[0]
            
            this.city = e.data.lives[0].city
            this.province = e.data.lives[0].province
            this.reporttime = e.data.lives[0].reporttime
            
            this.today.data[1][0] = e.data.lives[0].temperature
            this.today.data[1][1] = e.data.lives[0].humidity
            this.today.data[1][2] = e.data.lives[0].winddirection
            this.today.data[1][3] = e.data.lives[0].windpower
            
            this.today.weather = e.data.lives[0].weather
          }
          if (extensions == 'all') {
            this.city = e.data.forecasts[0].city
            this.province = e.data.forecasts[0].province
            this.reporttime = e.data.forecasts[0].reporttime
            this.casts = e.data.forecasts[0].casts
            
            // this.forecasts = e.data.forecasts[0].casts.map(d => {
            //   return [d.date.substr(5), d.week, d.dayweather, d.daytemp, d.daywind, d.daypower]
            //     // d.nightpower, d.nighttemp, d.nightweather, d.nightwind,
            // })
          }
        },
        fail: (e) => {
          this.showToast('网络问题')
          console.log(e)
        }
      })
    },
    // 
    check(type = 'all', data=null) {
      switch(type) {
        case 'key': {
          if (this.gd_key == '') {this.showToast('请输入 key');return false}
        };break;
        case 'state': {
          if (data.status != '1') {if(this.debug)console.log(data); this.showToast('错误的服务器返回值:'+data.info);return false}
        };break;
        case 'adcode': {
          if (data) {
            if (typeof data.adcode != 'string') {
              if(this.debug) console.log(data);
              if(data.province == "局域网") this.showToast('局域网 IP');
              else this.showToast('获取位置失败...');
              return false
            }
          } else {
            if (this.adcode == '') {this.showToast('请输入城市编码');return false}
            if (typeof this.adcode != 'string') {this.showToast('获取位置失败');return false}
          }
        };break;
        case 'obj': {
          if (typeof data != 'object') return false
        };break;
      }
      return true
    },
    showToast(title) {
      uni.showToast({
        icon:"none",
        title:title
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .oea-gd-weather {
    min-height: 100px;
    background-color: white;
  
    &__c {
      position: relative;
      min-height: 180px;
      color: #696969;
      font-size: 14px;
      background: #F7F7FA;
      
      &_head {
        height: 50px;
        font-size: 20px;
        font-weight: bold;
        display: flex;
        align-items: center;
        
        &_citySwitch {
          width: 10%;
          display: flex;
          justify-content: flex-start;
          padding-left: 12px;
          &_icon {
            width: 22px;
            height: 22px;
            border-radius: 8px;
          }
          &_icon:active {
            background: darkgray !important;
            color: #000 !important;
          }
        }
        &_title {
          width: 80%;
          display: flex;
          justify-content: center;
        }
        &_update {
          width: 10%;
          display: flex;
          justify-content: flex-end;
          padding-right: 12px;
          &_icon {
            width: 22px;
            height: 22px;
            border-radius: 8px;
          }
          &_icon:active {
            background: darkgray !important;
          }
        }
      }
      
      &_temperature {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      
    }
  }
  
  // 卡片模式
  .oea-weather-card {
    border-radius: 8px;
    margin: 4px;
    box-shadow: 0 0 15rpx #8f8f94; //投影.
  }
  // 圆角
  .oea-weather-card_radius {
    border-radius: 20px;
  }
  
  // 居中
  .xy_center {
    display: flex;
	font-weight: bolder;
    justify-content: center;
	font-size: 35rpx;
    align-items: center;
  }
  
  
</style>
