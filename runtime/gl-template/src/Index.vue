<template>
  <div>template</div>
</template>

<script>

  export default {
    name: 'GlTemplate',
    components: {},
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
      params: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
      }
    },
    watch: {
    },
    created() {
    },
    destroyed() {
    },
    mounted() {
    },
    methods: {
    }
  }
</script>

<style>
</style>
