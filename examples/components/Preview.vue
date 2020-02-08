<template>
  <gl-page :page-id="pageId" @doAction="doAction"></gl-page>
</template>

<script>

  export default {
    name: 'GlIdePreview',
    components: {},
    props: {},
    data() {
      return {
        pageId: this.$route.params.pageId
      }
    },
    mounted() {
    },
    methods: {
      doAction(data) {
        this.$emit('doAction', data)
      }
    }
  }
</script>

<style scoped>

</style>

