<template>
  <div class="gl-ide-plugin-designer-settings">
    <template v-if="config&&config.bind&&config.bind.opts">
      <gl-setting-control v-if="config.bind.opts.control" :opts="config.bind.opts"></gl-setting-control>
      <gl-setting-style v-if="config" :config="config"></gl-setting-style>
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
  export default {
    name: 'GlIdePluginLayoutControlSettings',
    components: {},
    props: {
      ideStore: {
        type: Object
      },
      config: {
        type: Object
      }
    },
    data() {
      return {}
    },
    watch: {},
    updated() {
      this.reset()
    },
    mounted() {
      console.log('config>', this.config)
      this.reset()
    },
    created() {
    },
    destroyed() {
    },
    methods: {
      reset() {
        if (!this.config) {
          return
        }
      }
    }
  }
</script>

<style scoped>
</style>
