<template>
  <view style="height: 1px;" :style="[_top, _bottom, _left, _right]"><slot/></view>
</template>

<script>
  
  /**
   * oea-separate
   * @description 分隔栏
   * 
   * 
   * 
   */
  
  export default {
    name: 'oea-separate',
    props: {
      top: {
        type: [Number, String],
        default: 0
      },
      bottom: {
        type: [Number, String],
        default: 0
      },
      left: {
        type: [Number, String],
        default: 0
      },
      right: {
        type: [Number, String],
        default: 0
      },
    },
    computed: {
      _top() {
        let res = this.top
        if (!res) return
        if (typeof res == 'number') res += 'px'
        return {marginTop: res}
      },
      _bottom() {
        let res = this.bottom
        if (!res) return
        if (typeof res == 'number') res += 'px'
        return {marginBottom: res}
      },
      _left() {
        let res = this.left
        if (!res) return
        if (typeof res == 'number') res += 'px'
        return {marginLeft: res}
      },
      _right() {
        let res = this.right
        if (!res) return
        if (typeof res == 'number') res += 'px'
        return {marginRight: res}
      }
    }
  }
</script>

<style>
  .a {
    margin-top: 0%;
    margin-bottom: 0%;
    margin-left: 0%;
    margin-right: 0%;
  }
</style>