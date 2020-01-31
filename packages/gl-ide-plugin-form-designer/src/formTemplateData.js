export default {
  type: 'object',
  // 表单可绑定多实体，这是默认第一实体
  defaultEntity: 'platform_demo_entity',
  // update|create|read
  state: 'save',
  properties: {
    // 设置该id:{}，便于子实体中依赖该id
    id: {},
  },
  layout: {
    type: 'table',
    rows: [],
    hidden: {}
  },
  ds: {},
  vars: {},
  watch: {}
}
