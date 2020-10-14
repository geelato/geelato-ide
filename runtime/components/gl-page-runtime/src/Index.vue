<template>
  <a-card :bordered="false">
    <gl-page v-if="refreshFlag" :page-id="pageId" :extend-id="extendId"></gl-page>
  </a-card>
</template>

<script>
  export default {
    name: 'GlPageRuntime',
    components: {},
    props: {},
    data () {
      return {
        pageId: this.$route.params.pageId,
        extendId: this.$route.name,
        refreshFlag: true
      }
    },
    watch: {
      '$route.name': function (val, oval) {
        this.forceRefresh()
      }
    },
    mounted () {
    },
    methods: {
      /**
       * 更新状态，强行触发
       * */
      forceRefresh () {
        this.refreshFlag = false
        this.$nextTick(() => {
          this.pageId = this.$route.params.pageId
          this.extendId = this.$route.name
          this.refreshFlag = true
        })
      }
    }
  }
</script>

<style scoped>
</style>
