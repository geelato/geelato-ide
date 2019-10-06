<template>
  <div class="gl-content-wrapper">
    这是组件树
  </div>
</template>
<script>
  export default {
    name: 'GlIdeSettingObjectTree',
    props: {
      ideStore: Object,
      default() {
        return {}
      }
    },
    data() {
      return {
      }
    },
    computed: {
    },
    watch: {
      'ideStore.editingFile.id': {
        handler(val, oval) {
        },
        immediate: true,
        // deep: true
      }
    },
    mounted: function () {
    },
    methods: {
      onPropertyUpdate({property, val, oval}) {
        let values = this.$refs.form.getValues()
        this.$ide.commitFile({description: values.description})
      },
      getValues() {

      }
    },
    components: {}
  }
</script>
<style scoped>
  .ant-form-item {
    /*background-color: #d8d8d8;*/
    margin-bottom: 5px;
  }

  .ant-form-item-control-wrapper, .ant-form-item-control {
    /*background-color: #ffffff;*/
  }
</style>

