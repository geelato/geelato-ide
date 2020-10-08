<template>
  <div style="width:100%;">
    <a-row>
      <a-col :span="17" style="border-right: 1px solid #F2F2F2">
        <stage v-if="refreshToggleFlag" :opts="cardBind"></stage>
      </a-col>
      <a-col :span="7">
        <settings :opts="cardBind" @change="onChange"></settings>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import Stage from './Stage'
  import Settings from './Settings'

  export default {
    name: "GlIdePluginSegmentDesigner",
    components: {Stage, Settings},
    props: {
      opts: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        refreshToggleFlag: true,
        size: 'default',
        cardBind: {}
      }
    },
    watch: {},
    created() {
      // 设置初始化值，确保所有值都可双向绑定
      this.cardBind = this.opts
    },
    methods: {
      refreshStage() {
        let that = this
        that.refreshToggleFlag = false
        that.$nextTick(function () {
          that.refreshToggleFlag = true
        })
      },
      onChange(e) {
        if (e.needRefreshStage) {
          this.refreshStage()
        }
      }

    }
  }
</script>

<style scoped>
  .ant-tabs-tab, .ant-tabs-bar {
    margin: 0
  }
</style>
