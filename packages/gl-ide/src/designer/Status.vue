<template>
  <div class="gl-designer-status">
    status
  </div>
</template>

<script>
  import mixin from '../../../mixin'

  export default {
    name: "gl-designer-status",
    mixins: [mixin],
    data() {
      return {}
    },
    props: {},
    methods: {
      callback(key) {
        console.log(key)
      },
    },
  }
</script>

<style scoped>

</style>
