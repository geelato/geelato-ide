<template>
  <div v-if="config.opts.layout.rows">
    <gl-page-item
        :rows="config.opts.layout.rows"
        :componentRefs="config.componentRefs"
        :events="config.events"
        :bindEvents="config._bindEvents"
        :gutter="config.opts.layout.gutter"
        :treeNodes="config.objectTree"
        @doAction="doAction"
    ></gl-page-item>
  </div>
</template>

<script>
  import GlPageItem from './Item'

  export default {
    name: 'GlPage',
    components: {GlPageItem},
    props: {
      gid: {
        type: String,
        default() {
          return this.$gl.utils.uuid(8)
        }
      },
      pageId: String,
      pageCode: String,
      extendId: String
    },
    data() {
      return {
        config: {
          componentRefs: {},
          opts: {layout: {}},
          events: {}
        }
      }
    },
    created() {
      this.$gl.ui.pages = this.$gl.ui.pages || {}
      this.$gl.ui.pages[this.gid] = this
    },
    destroyed() {
      delete this.$gl.ui.pages[this.gid]
    },
    mounted() {
      this.refresh()
    },
    methods: {
      refresh() {
        const that = this
        let condition = {}
        if (this.pageId) {
          condition = {id: this.pageId}
        } else if (this.extendId) {
          // 基于页面文件树节点id
          condition = {extendId: this.extendId}
        } else if (this.pageCode) {
          condition = {code: this.pageCode}
        }
        that.$gl.api.query('platform_app_page', 'id,type,code,description,sourceContent', condition).then(function (res) {
          console.log('platform_app_page res>', res)

          that.config = JSON.parse(res.data[0].sourceContent)
          that.config.componentRefs = that.config.componentRefs || {}
          that.config._bindEvents = {}
          console.log('that.config>', that.config)
        }).catch(function (e) {
          console.error(e)
          that.$message.error('从服务端获取、解析信息失败！')
        })
      },
      doAction(data) {
        console.log('doAction................', data)
        this.$emit('doAction', data)
      }
    }
  }
</script>

<style scoped>

</style>
