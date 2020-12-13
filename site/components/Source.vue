<template>
  <gl-page :page-id="pageId"></gl-page>
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
    methods: {}
  }
</script>

<style scoped>

</style>

