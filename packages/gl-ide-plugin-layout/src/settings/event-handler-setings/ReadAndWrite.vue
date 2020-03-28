<template>
  <div>
    <table class="gl-table">
      <tr class="gl-table-row">
        <td class="gl-table-cell gl-table-cell-sub-label">
          只读/可写对象：
        </td>
        <td class="gl-table-cell">
          <select-object></select-object>
        </td>
      </tr>
      <tr class="gl-table-row">
        <td class="gl-table-cell gl-table-cell-sub-label">
          设置为：
        </td>
        <td class="gl-table-cell">
          <a-radio-group value="show" size="small">
            <a-radio-button value="show">只读</a-radio-button>
            <a-radio-button value="hidden">可写</a-radio-button>
            <a-radio-button value="toggle">切换</a-radio-button>
          </a-radio-group>
          <a-alert
              message="切换：若当前为只读状态则变为可写，若当前为可写状态则变为只读"
              banner
              type="info"
          />
        </td>
      </tr>
    </table>
  </div>
</template>

<script>

  import SelectObject from './SelectObject'

  export default {
    props: {
      params: {
        type: Object,
        default() {
          return {
            title: '',
            width: '',
            height: '',
            actions: [],
            paramMapping: []
          }
        }
      },
      designComponentName: {
        type: String
      }
    },
    components: {SelectObject},
    data() {
      return {
        displayInfo: {
          items: []
        }
      };
    },
    watch: {},
    created() {
    },
    mounted() {
    },
    beforeDestroy() {
      this.$emit('update', this.displayInfo)
    },
    methods: {}
  }
</script>

<style scoped>
</style>
