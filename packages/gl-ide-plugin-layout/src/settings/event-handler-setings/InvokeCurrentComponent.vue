<template>
  <div>
    <table class="gl-table">
      <tbody v-if="designComponentName">
      <tr>
        <td class="gl-table-cell label" style="width: 20%">方法</td>
        <td>
          <a-select v-model="fn.name" style="min-width: 99%" @change="handleChange($event,fn)">
            <a-select-option v-for="method in getApi().methods" :key="method.name"
                             :title="method.title">
              {{method.name}}&nbsp;({{method.title}})
            </a-select-option>
          </a-select>
        </td>
      </tr>
      <tr>
        <td class="gl-table-cell label">参数</td>
        <td>
          <table style="margin: 2px;width: 100%" v-if="fn.params&&fn.params.length>0">
            <tr v-for="param in fn.params">
              <td class="gl-table-cell label" style="width: 30%"><span><a-icon type="info-circle"
                                                                               :title="param.description"/></span>{{param.title}}
              </td>
              <td class="gl-table-cell">
                <a-input v-model="param.value" style="min-width: 99%" :placeholder="param.placeholder||param.name"
                       @change="updateSettings"/>
              </td>
            </tr>
          </table>
          <div style="margin: 0.5em;width: 100%" v-else>
            无
          </div>
        </td>
      </tr>
      <tr>
        <td class="gl-table-cell label" style="width: 20%">说明</td>
        <td style="padding: 0.5em">
          {{fn.description}}
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import componentsMeta from '../../../../gl-ide-plugin-cards/src/componentsMeta'

  export default {
    props: {
      params: {
        type: Object,
        default() {
          return {}
        }
      },
      designComponentName: {
        type: String
      }
    },
    data() {
      return {
        meta: {},
        fn: {
          name: '',
          params: []
        }
      }
    },
    created() {
      this.meta = componentsMeta
    },
    mounted() {
      if (this.params && this.params.InvokeCurrentComponent && this.params.InvokeCurrentComponent.fn) {
        this.fn = this.params.InvokeCurrentComponent.fn
      }
    },
    methods: {
      getApi() {
        return this.meta[this.designComponentName]
      },
      handleChange(methodName, fn) {
        console.log('handleChange()>', methodName, fn, this.designComponentName)
        let method = this.getApi().methods.find(method => method.name === methodName)
        Object.assign(fn, JSON.parse(JSON.stringify(method)))
        this.updateSettings()
      },
      updateSettings() {
        this.$emit('update', {
          InvokeCurrentComponent: {
            fn: this.fn
          }
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
