<template>
  <div style="padding: 2em">
    <div v-if="config.opts.layout.rows">
      <GlIdePluginLayoutStageItem :rows="config.opts.layout.rows"
                                  :componentRefs="config.componentRefs"
                                  :events="config.events"
                                  :bindEvents="config._bindEvents"
                                  :gutter="config.opts.layout.gutter"
                                  :treeNodes="config.objectTree"
      ></GlIdePluginLayoutStageItem>
    </div>
  </div>
</template>

<script>
  import GlIdePluginLayoutStageItem from './Item'

  export default {
    name: 'GlIdePreview',
    components: {GlIdePluginLayoutStageItem},
    props: {},
    data() {
      return {
        config: {
          componentRefs: {},
          opts: {layout: {}},
          events: {}
        }
      }
    },
    mounted() {
      this.refresh()
    },
    methods: {
      refresh() {
        let that = this
        that.$gl.api.query('platform_app_page', 'id,type,code,description,sourceContent', {id: this.$route.params.pageId}).then(function (res) {
          that.config = JSON.parse(res.data[0].sourceContent)
          that.config.componentRefs = that.config.componentRefs || {}
          that.config._bindEvents = {}
          console.log('that.config>', that.config)
        }).catch(function (e) {
          console.error(e)
          that.$message.error('从服务端获取、解析信息失败！')
        })
      }
    }
  }
</script>

<style scoped>

</style>

