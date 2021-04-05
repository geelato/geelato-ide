<template>
  <a-card :bordered="false">
    <gl-page :ref="pageRefId" v-if="refreshFlag" :page-id="pageId" :extend-id="extendId"></gl-page>
  </a-card>
</template>

<script>
  export default {
    name: 'GlPageRuntime',
    components: {},
    props: {},
    data() {
      return {
        pageId: this.$route.params.pageId,
        extendId: this.$route.params.extendId,
        refreshFlag: true
      }
    },
    watch: {
      '$route.name': function (val, oval) {
        this.forceRefresh()
      }
    },
    computed: {
      pageRefId() {
        return this.pageId + '_' + this.extendId
      }
    },
    mounted() {
      console.log('gl-page-runtime > mounted() > i18n.locale:', this.$i18n.locale)
      console.log('gl-page-runtime > mounted() > i18n.locale:', this.$i18n.locale)
      console.log('gl-page-runtime > mounted() > i18n:', this.$i18n)

      this.$gl.ctx = this.$gl.ctx || {}
      this.$gl.ctx.pages = this.$gl.ctx.pages || {}
      console.log('gl-page-runtime > mounted() > pageRefId>', this.pageRefId)
      console.log('gl-page-runtime > mounted() > $refs>', this.$refs)
      this.$gl.ctx.pages[this.pageRefId] = this.$refs[this.pageRefId]
      console.log('gl-page-runtime > mounted() > pages:', this.$gl.ctx.pages)
    },
    beforeDestroy() {
      delete this.$gl.ctx.pages[this.pageRefId]
      console.log('gl-page-runtime > beforeDestroy() > pages:', this.$gl.ctx.pages)
    },
    methods: {
      /**
       * 更新状态，强行触发
       * */
      forceRefresh() {
        this.refreshFlag = false
        this.$nextTick(() => {
          this.pageId = this.$route.params.pageId
          this.extendId = this.$route.params.extendId
          this.refreshFlag = true
        })
      }
    }
  }
</script>

<style scoped>
</style>
