<template>
  <div :style="{height:height}">加载中...</div>
</template>
<script>
  export default {
    name: 'GlIdeStageBlank',
    props: {
      height: {
        type: String,
        default: function () {
          return '480px'
        }
      }
    },
    data() {
      return {}
    },
    watch: {
      // 'editingPage.id': function (val, oval) {
      // }
    },
    mounted: function () {
      this.init()
    },
    methods: {
      init() {
      },
      setValue(contentString = '') {
      },
      commit() {
        return {code: 0, msg: ''}
      }
    },
    components: {}
  }
</script>
<style>
</style>

