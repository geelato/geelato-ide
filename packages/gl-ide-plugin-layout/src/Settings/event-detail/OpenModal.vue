<template>
  <div>
    <gl-form ref="form" :opts="opts" :query="params" @propertyUpdate="onPropertyUpdate"></gl-form>
  </div>
</template>

<script>
  export default {
    props: {
      params: {
        type: Object,
        default() {
          return {
            title: '',
            width: '',
            height: ''
          }
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
            title: {
              control: 'input',
              title: '窗口标题'
            },
            width: {
              control: 'input',
              title: '窗口宽度(px)',
              rules: {
                required: true,
              },
              props: {
                placeholder: '1200px'
              }
            },
            height: {
              control: 'input',
              title: '窗口高度(px)',
              rules: {
                required: true,
              },
              props: {
                placeholder: '800px'
              }
            },
            pageName: {
              control: 'input',
              title: '打开页面的名称',
              rules: {
              },
              props: {
                placeholder: 'XX表单',
                readonly: true
              }
            },
            pageId: {
              control: 'input',
              title: '打开页面的ID',
              rules: {
                required: true,
              },
              props: {
                placeholder: 'GlPageLayout_GtOkj2Sd'
              }
            },
            // page: {
            //   control: 'select',
            //   title: '页面内容',
            //   // 若数据是动态生产成，可配置ds，基于ds加载的数据最终会设置到data中
            //   data: [
            //     {text: '保密', value: 'none'},
            //     {text: '男', value: 'male'},
            //     {text: '女', value: 'female'}
            //   ],
            //   value: 'none'
            // },
            description: {
              control: 'textarea',
              title: '描述'
            }
          },
          layout: {
            type: 'table',
            rows: [{
              cols: [{
                span: 24,
                rows: [{cols: [{span: 6, label: true, field: 'title'}, {span: 18, field: 'title'}]}]
              }]
            }, {
              cols: [
                {span: 6, label: true, field: 'width'}, {span: 6, field: 'width'},
                {span: 6, label: true, field: 'height'}, {span: 6, field: 'height'}
              ]
            }, {
              cols: [{
                span: 24,
                rows: [{cols: [{span: 6, label: true, field: 'pageId'}, {span: 18, field: 'pageId'}]}]
              }]
            }, {
              cols: [{
                span: 24,
                rows: [{cols: [{span: 6, label: true, field: 'pageName'}, {span: 18, field: 'pageName'}]}]
              }]
            }],
            hidden: {
              // 各表单状态，需隐藏的内容
              common: {
                typeA: 'gs:$ctx.form.type!=="typeA"',
                typeB: 'gs:$ctx.form.type!=="typeB"',
                typeC: 'gs:$ctx.form.type!=="typeC"'
              },
              update: {password: 1, confirmPassword: 2},
              create: {},
              read: {}
            }
          },
          ds: {
            province: {
              entity: 'platform_province',
              // default false
              lazy: false,
              // 支持字段重命名
              fields: 'name,code',
              resultMapping: {
                text: 'name',
                value: 'code'
              },
              description: '这是一个下拉列表数据源'
            },
            city: {
              entity: 'platform_city',
              lazy: true,
              fields: 'name,code',
              resultMapping: {
                text: 'name',
                value: 'code'
              },
              // 带参数查询的数据源
              params: {
                // 该信息会自动加入计算属性中，当province的值变动时，该数据源会重新加载计算
                provinceCode: 'gs:$ctx.form.province'
              },
              description: '这是一个下拉列表数据源，带参数'
            }
          },
          vars: {
            myVarA: {
              description: '这是一个变量，变量名字为myVarA，值为30',
              value: '30'
            }
          },
          watch: {
            'code': function () {

            }
          }
        }
      };
    },
    mounted() {

    },
    methods: {
      onPropertyUpdate(property, val, oval) {
        let form = this.$refs.form.getValues()
        // this.params.title = form.title
        // this.params.width = form.width
        // this.params.height = form.height
        this.$emit('update', {
          title: form.title,
          width: form.width,
          height: form.height,
          pageId: form.pageId,
          pageName: form.pageName
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
