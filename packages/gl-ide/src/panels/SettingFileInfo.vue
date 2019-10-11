<template>
  <div class="gl-content-wrapper">
    <gl-form ref="form" :opts="formConfig" :query="formQuery" @propertyUpdate="onPropertyUpdate"></gl-form>
  </div>
</template>
<script>
  export default {
    name: 'GlIdeSettingFileInfo',
    props: {
      ideStore: Object,
      default() {
        return {}
      }
    },
    data() {
      return {
        formConfig: {
          properties: {
            type: {
              control: 'input',
              title: '类型',
              props: {
                readonly: true
              }
            },
            component: {
              control: 'input',
              title: '组件',
              props: {
                readonly: true
              }
            },
            code: {
              control: 'input',
              title: '编码',
              props: {
                readonly: true
              }
            },
            description: {
              control: 'textarea',
              title: '描述',
            }
          },
          layout: {
            rows: [
              {
                cols: [
                  {span: 8, label: true, field: 'type'}, {span: 16, field: 'type'},
                ]
              },
              {
                cols: [
                  {span: 8, label: true, field: 'component'}, {span: 16, field: 'component'},
                ]
              },
              {
                cols: [
                  {span: 8, label: true, field: 'code'}, {span: 16, field: 'code'},
                ]
              },
              {
                cols: [
                  {span: 8, label: true, field: 'description'}, {span: 16, field: 'description'},
                ]
              }
            ]
          }
        },
        formQuery: {}
      }
    },
    computed: {
      // formQuery: function () {
      //   let formQuery = {}
      //
      //   return formQuery
      // }
    },
    watch: {
      'ideStore.editingFile.id': {
        handler(val, oval) {
          let that = this
          this.$set(this.formQuery, 'code', this.ideStore.editingFile.code)
          this.$set(this.formQuery, 'description', this.ideStore.editingFile.description)
          this.$set(this.formQuery, 'component', this.ideStore.editingFile.sourceContent.component)
          this.$set(this.formQuery, 'type', this.ideStore.editingFile.type)
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

