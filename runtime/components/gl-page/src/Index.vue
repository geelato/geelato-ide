<template>
  <div class="gl-page" style="height: 100%" ref="xx">
    <template v-if="opts.src==='external'">
      <iframe ref="iframe" :src="opts.url" style="border:0" :style="iframeStyle"></iframe>
    </template>
    <template v-else>
      <template v-if="config.opts.layout.rows">
        <gl-page-item
            v-if="refreshFlag"
            :rows="config.opts.layout.rows"
            :componentRefs="config.componentRefs"
            :events="config.events"
            :bindEvents="config._bindEvents"
            :gutter="config.opts.layout.gutter"
            :treeNodes="config.objectTree"
            :params="params"
            @doAction="doAction"
        ></gl-page-item>
      </template>
      <!--<template v-else>-->
      <!--<a-alert v-if="isPageSetted()" message="未指定引用的页面"-->
      <!--description="请点击上方的设置图标，进入设置页面。"-->
      <!--type="info"-->
      <!--showIcon-->
      <!--/>-->
      <!--<a-alert v-else message="加载中..."-->
      <!--description=""-->
      <!--type="info"-->
      <!--showIcon-->
      <!--/>-->
      <!--</template>-->
    </template>
  </div>
</template>

<script>
  import GlPageItem from './Item'

  export default {
    name: 'GlPage',
    components: {GlPageItem},
    props: {
      opts: {
        type: Object,
        default() {
          return {}
        }
      },
      gid: {
        type: String,
        default() {
          return this.$gl.utils.uuid(8)
        }
      },
      pageId: String,
      extendId: String,
      params: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        config: {
          componentRefs: {},
          opts: {layout: {}},
          events: {}
        },
        refreshFlag: true,
        iframeStyle: {
          width: '100%',
          height: '100%'
        },
        iframeWin: {},
        iframeDocument: {}
      }
    },
    watch: {
      'opts.extendId': {
        handler: function (val, oval) {
          console.log('geelato > runtime > gl-page > Index.vue > watch > opts.pageId val,oval:', val, oval)
          this.refresh()
        },
        immediate: false
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
      console.log('geelato > runtime > gl-page > Index.vue > mounted() > opts: ', this.opts)
      console.log('geelato > runtime > gl-page > Index.vue > mounted() > params: ', this.params)
      console.log('geelato > runtime > gl-page > Index.vue > mounted() > $refs: ', this.$refs)
      if (this.opts.src === 'external') {
        const iframe = this.$refs.iframe
        const iframeWin = iframe.contentWindow || iframe.contentDocument
        this.iframeDocument = iframeWin.document || iframeWin
        console.log('this.$refs.iframe.body.scrollHeight:', [this.iframeDocument.body], this.iframeDocument.body.scrollHeight)

        // this.resizeIframe()
      } else if (this.opts.src === 'platform') {
        this.reloadPage()
      } else {
        // 不是基于opts传值的情况
        this.reloadPage()
        // this.refresh()
      }
    },
    methods: {
      refresh() {
        this.refreshFlag = false
        this.$nextTick(function () {
          this.refreshFlag = true
        })
      },
      isPageSetted() {

      },
      reloadPage() {
        const that = this
        let condition = {}
        if (this.pageId || that.opts.pageId) {
          condition = {id: this.pageId || that.opts.pageId}
        } else if (this.extendId || that.opts.extendId) {
          // 基于页面文件树节点id
          condition = {extendId: this.extendId || that.opts.extendId}
        } else {
          return
        }
        console.log('geelato > runtime > gl-page > Index.vue > reloadPage() > try to load Page by condition:', condition)
        that.$gl.api.query('platform_app_page', 'id,type,code,description,sourceContent', condition).then(function (res) {
          console.log('geelato > runtime > gl-page > Index.vue > reloadPage() > load res:', res)
          if (res.data.length === 0) {
            that.$message.warn('从服务端获取不到该页面信息，可能该页面已删除！')
          } else {
            that.config = JSON.parse(res.data[0].sourceContent)
            that.config.componentRefs = that.config.componentRefs || {}
            that.config._bindEvents = {}
            console.log('geelato > runtime > gl-page > Index.vue > reloadPage() > page config:', that.config)
          }
        }).catch(function (e) {
          console.error('geelato > runtime > gl-page > Index.vue > reloadPage() > load page err: ', e)
          that.$message.error('从服务端获取、解析信息失败！')
        })
      },
      doAction(data) {
        console.log('geelato > runtime > gl-page > Index.vue > doAction() > emit doAction width data:', data)
        this.$emit('doAction', data)
      },
      resizeIframe(val) {
        const iframe = val.path[0]
        console.log('this.$refs.iframe>', val)
        // let win = this.$gl.utils.eval('$ctx.contentWindow', iframe)
        // console.log('this.$refs.iframe> win:', win)

        iframe.contentWindow.postMessage('hello...')
        // console.log('this.$refs.iframe>', win)
        console.log('this.$refs.iframe.body.scrollHeight:', [this.iframeDocument.body], this.iframeDocument.body.scrollHeight)

        // 这里就拿到了iframe的window对象
        // let iframe = this.$refs.iframe // val.path[0]
        console.log('geelato > runtime > gl-page > Index.vue > resizeIframe() > iframe:', this.$refs.iframe, this.$refs.iframe.document)
        console.log('geelato > runtime > gl-page > Index.vue > resizeIframe() > iframeDocument:', this.iframeDocument)
        console.log('geelato > runtime > gl-page > Index.vue > resizeIframe() > iframeWin:', this.iframeDocument.documentElement)

        try {
          const bHeight = this.iframeDocument.body.scrollHeight
          const dHeight = this.iframeDocument.documentElement.scrollHeight
          console.log('geelato > runtime > gl-page > Index.vue > resizeIframe() > bHeight,:', bHeight, dHeight)

          const height = Math.min(bHeight, dHeight)
          // iframe.style.height = height + 50 + 'px'
          // console.log('geelato > runtime > gl-page > Index.vue > resizeIframe() iframe.height:', iframe.height)

          // if (this.opts.sizeMode === 'auto') {
          //   this.iframeStyle = {
          //     width: '100%',
          //     height: height + 'px'
          //   }
          // } else {
          //   this.iframeStyle = {
          //     width: this.opts.width || '100%',
          //     height: this.opts.height || '100%'
          //   }
          // }

        } catch (e) {
          console.error('resizeIframe error:', e)
        }
      }
    }
  }
</script>

<style>
  .gl-ide-preview .gl-ide-layout-stage .gl-dnd-row-handle {
    border: 0px solid #f0f0f0;
    margin-bottom: 0.1em;
    cursor: move;
  }

  .gl-ide-preview .gl-ide-layout-stage .gl-dnd-row-handle.sortable-chosen {
    background-color: rgb(107, 209, 255);
  }

  /*.gl-ide-preview .gl-dnd-col-wrapper {*/
  /*min-height: 2em;*/
  /*}*/

  .gl-ide-preview .gl-dnd-row-toolbar {
    position: absolute;
    right: -0.5em;
    display: none;
  }

  .gl-ide-preview .gl-dnd-row-toolbar i {
    font-size: 1.5em;
    line-height: 1.5em;
    cursor: pointer;
  }

  .gl-ide-preview .gl-dnd-row-handle:hover .gl-dnd-row-toolbar {
    display: inline-block;
  }

  .gl-ide-preview .gl-dnd-col-toolbar {
    padding: 0 1em;
    line-height: 2em;
    height: 2em;
    background-color: #e5e5e5
  }

  .gl-ide-preview .gl-dnd-col-toolbar button {
    background-color: #e5e5e5;
    border-color: #e5e5e5
  }

  /*.gl-ide-layout-stage .gl-dnd-row-handle > div {*/
  /*!*padding: 0 1px !important;*!*/
  /*}*/

  /*.gl-ide-layout-stage .gl-dnd-row-handle:hover > div > div {*/
  /*!*background-color: rgba(255, 202, 17, 0.7);*!*/
  /*}*/

  .gl-ide-preview .gl-ide-layout-stage .gl-dnd-row-handle:hover {
    /*box-shadow: 0 0 1px #000 inset;*/
    box-shadow: 0 0 4px #ffca11;
  }

  .gl-ide-preview .gl-ide-layout-stage .gl-dnd-row-handle > div > div {
    background-color: rgba(161, 222, 255, 0.35);
    /*text-align: center;*/
  }

  .gl-ide-preview .gl-ide-layout-stage .gl-dnd-row-handle > div > div:hover {
    /*background-color: rgba(211, 211, 211, 0.3);*/
    background-color: rgba(255, 202, 17, 0.35);
    /*border: 1px dotted #a5a5a5;*/
  }

  .gl-page .extra-wrapper > * {
    display: inline-block;
    margin-right: 1em;
  }
</style>
