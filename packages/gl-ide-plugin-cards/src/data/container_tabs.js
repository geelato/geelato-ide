import utils from '../../../../runtime/utils'


export default {
  buildOpts: function () {
    let gid = 'tabs_' + utils.uuid(11)
    let tab1gid = 'tab_' + utils.uuid(12)
    let tab2gid = 'tab_' + utils.uuid(12)
    return {
      gid: [gid],
      group: 'container',
      title: '标签容器',
      type: 'Tabs',
      opts: {
        tabPosition: 'top',
        type: 'line',
        size: 'default'
      },
      items: [
        {gid: [tab1gid], title: '标签一', items: []},
        {gid: [tab2gid], title: '标签二', items: []},
      ],
      slots: [],
      style: {}
    }
  },
  meta: {
    componentName: 'GlContainerTabs',
    designer: 'GlIdePluginContainerTabsDesigner',
    title: '标签编辑器',
    objectTree: [{title: '标签', path: 'items'}],
    // 该组件输入参数
    inParam: {
      path: 'properties',
      name: 'field',
      title: 'title'
    },
    outParams: [{
      group: '表单',
      type: Object,
      // 在设计配置页面中展示，选择参数
      name: 'field', title: 'title', path: 'items',
      // 在运行时获取参数值
      dataCtx: '$_ctxLoader().tabs'
    }],
    // 组件的接收参数
    props: [
      {name: 'params', description: ''}
    ],
    methods: [],
    data: [
      {
        name: 'tabs',
        type: 'object',
        description: '当前标签'
      }
    ]
  },
}
