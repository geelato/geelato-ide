<template>
  <div class="hello">
    preview:{{$route.params}}
  </div>
</template>

<script>
  export default {
    name: 'GlIdePreview',
    props: {
      msg: String
    }
  }
</script>

<style scoped>
</style>
