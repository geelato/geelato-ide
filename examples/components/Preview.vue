<template>
  <div style="padding: 2em">
    <div v-if="config.layout.rows">
      <GlIdePluginLayoutStageItem :rows="config.layout.rows"
                                  :cardMap="config.cardMap"
                                  :gutter="config.layout.gutter"></GlIdePluginLayoutStageItem>
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
          cardMap: {},
          layout: {}
        }
      }
    },
    mounted() {
      this.refresh()
    },
    methods: {
      refresh() {
        let that = this
        that.$gl.api.query('platform_dev_page', 'id,type,code,description,sourceContent', {id: this.$route.params.pageId}).then(function (res) {
          that.config = JSON.parse(res.data[0].sourceContent).opts
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

