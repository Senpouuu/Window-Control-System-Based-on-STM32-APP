<template>
  <view class="oea-grid-wrap">
    <view :id="elId" ref="oea-grid" class="oea-grid" :class="{ 'oea-grid--border': showBorder }" :style="{ 'border-left-color': borderColor }"><slot /></view>
  </view>
</template>

<script>
// #ifdef APP-NVUE
const dom = uni.requireNativePlugin('dom');
// #endif

/**
 * Grid 宫格
 * @description 宫格组件
 * @property {Number} column 每列显示个数
 * @property {String} borderColor 边框颜色
 * @property {Boolean} showBorder 是否显示边框
 * @property {Boolean} square 是否方形显示
 * @property {Boolean} highlight 点击背景是否高亮
 * @event {Function} change 点击 grid 触发，e={detail:{index:0}}，index 为当前点击 gird 下标
 */
export default {
  name: 'oea-grid',
  emits: ['change'],
  props: {
    // 每列显示个数
    column: {
      type: Number,
      default: 3
    },
    // 是否显示边框
    showBorder: {
      type: Boolean,
      default: false
    },
    // 边框颜色
    borderColor: {
      type: String,
      default: '#D2D2D2'
    },
    // 是否正方形显示,默认为 true
    square: {
      type: Boolean,
      default: true
    },
    highlight: {
      type: Boolean,
      default: true
    }
  },
  provide() {
    return {
      grid: this
    };
  },
  data() {
    const elId = `oea_${Math.ceil(Math.random() * 10e5).toString(36)}`;
    return {
      elId,
      width: 0
    };
  },
  created() {
    this.children = [];
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  },
  methods: {
    init() {
      setTimeout(() => {
        this._getSize(width => {
          this.children.forEach((item, index) => {
            item.width = width;
          });
        });
      }, 50);
    },
    change(e) {
      this.$emit('change', e);
    },
    _getSize(fn) {
      // #ifndef APP-NVUE
      uni
        .createSelectorQuery()
        .in(this)
        .select(`#${this.elId}`)
        .boundingClientRect()
        .exec(ret => {
          this.width = parseInt((ret[0].width - 1) / this.column) + 'px';
          fn(this.width);
        });
      // #endif
      // #ifdef APP-NVUE
      dom.getComponentRect(this.$refs['oea-grid'], ret => {
        this.width = parseInt((ret.size.width - 1) / this.column) + 'px';
        fn(this.width);
      });
      // #endif
    }
  }
};
</script>

<style lang="scss" scoped>
.oea-grid-wrap {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex: 1;
  flex-direction: column;
  /* #ifdef H5 */
  width: 100%;
  /* #endif */
}

.oea-grid {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  // flex: 1;
  flex-direction: row;
  flex-wrap: wrap;
}

.oea-grid--border {
  position: relative;
  /* #ifdef APP-NVUE */
  border-left-color: #d2d2d2;
  border-left-style: solid;
  border-left-width: 0.5px;
  /* #endif */
  /* #ifndef APP-NVUE */
  z-index: 1;
  border-left: 1px #d2d2d2 solid;
  /* #endif */
}
</style>
