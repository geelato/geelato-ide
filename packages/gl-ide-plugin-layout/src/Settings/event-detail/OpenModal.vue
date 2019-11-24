<template>
  <div>
    <gl-form ref="form" :opts="opts" :query="params" @propertyUpdate="onPropertyUpdate"></gl-form>
    <table class="gl-table">
      <tr class="gl-table-row gl-table-row-header">
        <th class="gl-table-cell" style="width: 35%">按钮名称</th>
        <th class="gl-table-cell" style="width: 25%">类型</th>
        <th class="gl-table-cell">设置</th>
      </tr>
      <template v-for="(action,actionIndex) in actions">
        <tr class="gl-table-row" :key="actionIndex">
          <!-- TODO change? -->
          <td class="gl-table-cell"><input v-model="action.text" style="width: 99%" @change="onActionUpdate()"/></td>
          <td class="gl-table-cell">
            <a-select v-model="action.type" :allowClear="true" @change="onActionUpdate()"
                      style="min-width: 99%">
              <a-select-option v-for="btnType in btnTypes" :key="btnType.value">
                {{btnType.text}}
              </a-select-option>
            </a-select>
          </td>
          <td class="gl-table-cell">
            <!--<a-button class="gl-mini-btn" v-if="currentActionIndex!==actionIndex"-->
            <!--@click="currentActionIndex = actionIndex" title="显示更多设置">-->
            <!--<a-icon type="eye"/>-->
            <!--</a-button>-->
            <!--<a-button class="gl-mini-btn" v-if="currentActionIndex===actionIndex"-->
            <!--@click="currentActionIndex = -1" title="隐藏更多设置">-->
            <!--<a-icon type="eye-invisible"/>-->
            <!--</a-button>-->
            <a-button class="gl-mini-btn" v-if="actionIndex!==0"
                      @click="$gl.utils.moveup(actions,actionIndex);onActionUpdate()">
              <a-icon type="arrow-up"/>
            </a-button>
            <a-button class="gl-mini-btn" v-if="actionIndex!==actions.length-1"
                      @click="$gl.utils.movedown(actions,actionIndex);onActionUpdate()">
              <a-icon type="arrow-down"/>
            </a-button>
            <a-button class="gl-mini-btn"
                      @click="$gl.utils.remove(actions,actionIndex);onActionUpdate()">
              <a-icon type="delete" theme="twoTone" twoToneColor="#eb2f96"/>
            </a-button>
          </td>
        </tr>
      </template>
      <tr class="gl-table-row">
        <td colspan="3">
          <a-button size="small" block
                    @click="actions.push({gid:$gl.utils.uuid(8),text: '操作',icon: 'plus',type: 'primary'});onActionUpdate()"
                    style="line-height: 1.499em">
            <a-icon type="plus" size="small"/>
            添加行操作按钮
          </a-button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
  /* eslint-disable no-unused-vars */

  import ideConfig from '../../../../gl-ide/src/data.js'

  export default {
    props: {
      params: {
        type: Object,
        default() {
          return {
            title: '',
            width: '',
            height: '',
            actions: []
          }
        }
      }
    },
    data() {
      return {
        currentActionIndex: 0,
        actions: this.params.actions || [],
        btnTypes: ideConfig.btnTypes,
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
              rules: {},
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
            actionAlign: {
              control: 'select',
              title: '按钮对齐方式',
              // 若数据是动态生产成，可配置ds，基于ds加载的数据最终会设置到data中
              data: [
                {text: '居中', value: 'center'},
                {text: '居右', value: 'right'},
                {text: '居左', value: 'left'}
              ],
              props: {
                defaultValue: 'center'
              }
            },
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
            }, {
              cols: [{
                span: 24,
                rows: [{cols: [{span: 6, label: true, field: 'actionAlign'}, {span: 18, field: 'actionAlign'}]}]
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
        this.onUpdate()
      },
      onActionUpdate() {
        this.onUpdate()
      },
      onUpdate() {
        let form = this.$refs.form.getValues()
        console.log('this.actions>', this.actions)
        this.$emit('update', {
          gid: this.params.gid || this.$gl.utils.uuid(8),
          title: form.title,
          width: form.width,
          height: form.height,
          pageId: form.pageId,
          pageName: form.pageName,
          actionAlign: form.actionAlign,
          actions: this.actions
        })
      }
    }
  }
</script>

<style scoped>
  .ant-form-item {
    margin-bottom: 4px;
  }
</style>
