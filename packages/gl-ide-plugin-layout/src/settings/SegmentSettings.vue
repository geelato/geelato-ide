<!--
-->
<template>
  <div class="gl-ide-plugin-designer-settings">
    <template v-if="config">
      <gl-setting-style :config="config"></gl-setting-style>
    </template>
    <a-alert v-else
             message="未选择组件或UI片段"
             description="请将鼠标移动到左边的设计界面上，点击。"
             type="info"
             showIcon
    />
  </div>
</template>

<script>

  import GlSettingStyle from "../../../components/gl-setting-style/Index";
  import events from "../../../gl-ide/src/events";

  export default {
    name: 'GlIdePluginLayoutSegmentSettings',
    components: {GlSettingStyle},
    props: {
      ideStore: {
        type: Object
      },
      config: {
        type: Object
      }
    },
    data() {
      return {};
    },
    watch: {
      // 'config': {
      //   handler: function (val, oval) {
      //     this.reset(val)
      //   },
      //   deep: true
      // }
    },
    created() {
      // this.$gl.bus.$on(events.ide_stage_component_delete)

      // this.reset()
    },
    updated() {
      console.log('GlIdePluginLayoutSegmentSettings > updated config..........', this.config)
    },
    mounted() {
      console.log('GlIdePluginLayoutSegmentSettings > mounted config..........', this.config)
    },
    destroyed() {
    },
    methods: {
      // reset() {
      //   if (!this.config) {
      //     return
      //   }
      //   if (!this.config.style) {
      //     this.$set(this.config, 'style', {})
      //   }
      //   console.log('GlIdePluginLayoutSegmentSettings > reset config..........', this.config)
      // }
    }
  }
</script>

<style>

  .gl-mp-size {
    cursor: default;
    user-select: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    font-weight: 400;
    line-height: 10px;
    letter-spacing: -0.2px;
    display: flex;
    color: rgb(139, 190, 250);
    background: rgba(76, 152, 241, 0.15);
    padding: 2px;
    margin-left: -2px;
    border-radius: 2px;
    max-width: 100%;
    box-sizing: content-box;
    place-self: center;
    position: relative;
    opacity: 1;
    align-items: center;
    justify-content: center;
  }

  .gl-mp-size .gl-text {
    min-width: 1em;
    min-height: 1em;
    text-align: center;
  }

</style>
