<!--
  通用样式设置
-->
<template>
  <div v-if="config&&config.style">
    <div class="gl-title">
      <a-icon type="setting"/>
      显示
    </div>
    <div>
      <table class="gl-table">
        <tr class="gl-table-row">
          <td class="gl-table-cell gl-table-cell-sub-label">
            模式-Display
          </td>
          <td class="gl-table-cell">
            <a-radio-group v-model="config.style.display" size="small">
              <a-radio-button value="" style="display: block">默认不设置</a-radio-button>
              <a-radio-button value="none" style="display: block">不显示(none)</a-radio-button>
              <a-radio-button value="block" style="display: block">块(block)-有换行</a-radio-button>
              <a-radio-button value="inline-block" style="display: block">行内块(inline-block)-无换行</a-radio-button>
              <a-radio-button value="inline" style="display: block">内联(inline)-无换行无宽高</a-radio-button>
            </a-radio-group>
          </td>
        </tr>
      </table>
    </div>
    <div class="gl-title">
      <a-icon type="setting"/>
      边矩
    </div>
    <div>
      <table class="gl-table">
        <tr class="gl-table-row">
          <td class="gl-table-cell gl-table-cell-sub-label">
            外边矩
            <div>
              (Margin)
            </div>
          </td>
          <td class="gl-table-cell">
            <div>
              <a-input v-model="config.style['margin-top']" :placeholder="placeholderMarginPadding">
                <span slot="addonBefore">上</span>
              </a-input>
            </div>
            <div>
              <a-input v-model="config.style['margin-left']" :placeholder="placeholderMarginPadding" style="width: 50%">
                <span slot="addonBefore">左</span>
              </a-input>
              <a-input v-model="config.style['margin-right']" :placeholder="placeholderMarginPadding"
                       style="width: 50%">
                <span slot="addonBefore">右</span>
              </a-input>
            </div>
            <div>
              <a-input v-model="config.style['margin-bottom']" :placeholder="placeholderMarginPadding">
                <span slot="addonBefore">下</span>
              </a-input>
            </div>
          </td>
        </tr>
        <tr class="gl-table-row">
          <td class="gl-table-cell gl-table-cell-sub-label">
            内边矩
            <div>
              (Padding)
            </div>
          </td>
          <td class="gl-table-cell">
            <div>
              <a-input v-model="config.style['padding-top']" :placeholder="placeholderMarginPadding">
                <span slot="addonBefore">上</span>
              </a-input>
            </div>
            <div>
              <a-input v-model="config.style['padding-left']" :placeholder="placeholderMarginPadding"
                       style="width: 50%">
                <span slot="addonBefore">左</span>
              </a-input>
              <a-input v-model="config.style['padding-right']" :placeholder="placeholderMarginPadding"
                       style="width: 50%">
                <span slot="addonBefore">右</span>
              </a-input>
            </div>
            <div>
              <a-input v-model="config.style['padding-bottom']" :placeholder="placeholderMarginPadding">
                <span slot="addonBefore">下</span>
              </a-input>
            </div>
          </td>
        </tr>
      </table>
    </div>
    <div class="gl-title">
      <a-icon type="setting"/>
      位置
    </div>
    <div>
      <table class="gl-table">
        <tr class="gl-table-row">
          <td class="gl-table-cell gl-table-cell-sub-label">
            浮动-float
          </td>
          <td class="gl-table-cell">
            <a-radio-group v-model="config.style.float" size="small">
              <a-radio-button value="">无</a-radio-button>
              <a-radio-button value="auto">自动</a-radio-button>
              <a-radio-button value="top">上</a-radio-button>
              <a-radio-button value="bottom">下</a-radio-button>
              <a-radio-button value="left">左</a-radio-button>
              <a-radio-button value="right">右</a-radio-button>
            </a-radio-group>
          </td>
        </tr>
      </table>
    </div>
    <div class="gl-title">
      <a-icon type="setting"/>
      大小
    </div>
    <div>
      <table class="gl-table">
        <tr class="gl-table-row">
          <td class="gl-table-cell gl-table-cell-sub-label">
            宽度-width
          </td>
          <td class="gl-table-cell">
            <a-input v-model="config.style.width" placeholder="100%"></a-input>
          </td>
        </tr>
      </table>
    </div>
    <div class="gl-title">
      <a-icon type="setting"/>
      排版
    </div>
    <div>
      <table class="gl-table">
        <tr class="gl-table-row">
          <td class="gl-table-cell gl-table-cell-sub-label">
            字体-Font
          </td>
          <td class="gl-table-cell">
            <!--<a-input v-model="config.style.width" placeholder="100%"></a-input>-->
          </td>
        </tr>
        <tr class="gl-table-row">
          <td class="gl-table-cell gl-table-cell-sub-label">
            字重-Weight
          </td>
          <td class="gl-table-cell">

          </td>
        </tr>
        <tr class="gl-table-row">
          <td class="gl-table-cell gl-table-cell-sub-label">
            字号-Size
          </td>
          <td class="gl-table-cell">
            <a-input v-model="config.style['font-size']" placeholder=""></a-input>
          </td>
        </tr>
        <tr class="gl-table-row">
          <td class="gl-table-cell gl-table-cell-sub-label">
            字高-Height
          </td>
          <td class="gl-table-cell">

          </td>
        </tr>
        <tr class="gl-table-row">
          <td class="gl-table-cell gl-table-cell-sub-label">
            对齐-TextAlign
          </td>
          <td class="gl-table-cell">
            <a-radio-group v-model="config.style['text-align']" size="small">
              <a-radio-button value="left"><a-icon type="align-left" /></a-radio-button>
              <a-radio-button value="center"><a-icon type="align-center" /></a-radio-button>
              <a-radio-button value="right"><a-icon type="align-right" /></a-radio-button>
              <a-radio-button value=""><a-icon type="menu" /></a-radio-button>
            </a-radio-group>
          </td>
        </tr>
      </table>
    </div>
    <div class="gl-title">
      <a-icon type="setting"/>
      背景
    </div>
    <div class="gl-title">
      <a-icon type="setting"/>
      边框
    </div>
  </div>
</template>

<script>
  export default {
    name: 'GlSettingStyle',
    props: {
      config: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        placeholderMarginPadding: '如24px'
      };
    },
    watch: {
      // 'config.style': {
      //   handler: function (val, oval) {
      //     if (oval === undefined) {
      //
      //     }
      //   },
      //   deep: true,
      //   immediate:true
      // }
    },
    created() {
      if (!this.config.style) {
        this.$set(this.config, 'style', {})
        this.$nextTick()
      }
    },
    updated() {
      console.log('GlStyleSettings > updated config:', this.config)
    },
    mounted() {
      console.log('GlStyleSettings > mounted config:', this.config)
    },
    destroyed() {
    },
    methods: {}
  }
</script>

<style>

</style>
