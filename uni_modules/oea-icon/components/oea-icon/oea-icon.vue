<template>
  <view>
    <view v-if="type == 'default'" :class="'oea-' + name" :style="[iconSize, _color]"></view>
    <view v-if="type == 'icofont'" :class="'icofont-' + name" :style="[iconSize, _color]"></view>
  </view>
</template>

<script>
/**
 * oea-icon
 * @description 图标组件
 * @property {String} type = ['default' | 'icofont'] 
 *
 */

export default {
  name: 'oea-icon',
  data() {
    return {};
  },
  computed: {
    _color() {
      let c = this.color
      if (c != '') return {color: c}
      return null
    },
    iconSize() {
      let s = this.size
      if (typeof s == 'string') {
        if (s.indexOf('px')>0) {
          return {fontSize: s}
        } else {
          if (s == 'xs') s = 11
          if (s == 's') s = 22
          if (s == 'm') s = 33
          if (s == 'l') s = 44
          if (s == 'xl') s = 55
          if (s == 'xxl') s = 88
          if (s == 'xxxl') s = 120
        }
      }
      if (s != 0) return {fontSize: s + 'px'}
      return null
    }
  },
  props: {
    type: {
      type: String,
      default: 'default'
    },
    name: {
      type: String,
      default: ''
    },
    size: {
      type: [Number, String],
      default: 0
    },
    color: {
      type: String,
      default: ''
    }
  },
  methods: {}
};
</script>

<style>
@import url('./lib/gg/oea-icon-gg.css');
@import url('./lib/icofont/icofont.css');

@font-face {
  font-family: "IcoFont";
  font-weight: normal;
  font-style: "Regular";
  src: url("./lib/icofont/fonts/icofont.woff2") format("woff2"),
    url("./lib/icofont/fonts/icofont.woff") format("woff");
}

</style>
