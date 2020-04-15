<template>
  <div>
    <gl-form ref="form" :opts="opts" :params="params.ShowMessage" @propertyUpdate="onPropertyUpdate"></gl-form>
  </div>
</template>

<script>
  export default {
    props: {
      params: {
        type: Object,
        default() {
          return {ShowMessage: {}}
        }
      }
    },
    data() {
      return {
        formLayout: 'horizontal',
        opts: {
          type: 'object',
          // 表单可绑定多实体，这是默认第一实体
          defaultEntity: '_form',
          // update|create|read
          state: 'save',
          properties: {
            // 设置该id:{}，便于子实体中依赖该id
            id: {},
            message: {
              control: 'input',
              title: '提示内容',
              rules: {
                required: true,
              },
              props: {
                placeholder: '提示内容'
              }
            },
            method: {
              control: 'select',
              title: '方法',
              // 若数据是动态生产成，可配置ds，基于ds加载的数据最终会设置到data中
              data: [
                {text: 'info', value: 'info'},
                {text: 'success', value: 'success'},
                {text: 'error', value: 'error'},
                {text: 'warn', value: 'warn'},
                {text: 'loading', value: 'loading'}
              ],
              props: {
                defaultValue: 'info'
              }
            },
          },
          layout: {
            type: 'table',
            rows: [
              {
                cols: [
                  {
                    span: 24,
                    rows: [{cols: [{span: 6, label: true, field: 'method'}, {span: 18, field: 'method'}]}]
                  }]
              },
              {
                cols: [
                  {
                    span: 24,
                    rows: [{cols: [{span: 6, label: true, field: 'message'}, {span: 18, field: 'message'}]}]
                  }]
              }
            ],
            hidden: {}
          },
          ds: {},
          vars: {},
          watch: {}
        }
      };
    },
    mounted() {

    },
    methods: {
      onPropertyUpdate(property, val, oval) {
        let form = this.$refs.form.getValues()
        this.$emit('update', {
          ShowNotification: {
            message: form.message,
            description: form.description
          }
        })
      }
    },
  }
</script>

<style scoped>
  .ant-form-item {
    margin-bottom: 4px;
  }
</style>
