import form from './form.js'
import table from './table.js'
import header from './header.js'

export default {
  items: [{
    title: '列表',
    icon: 'table',
    component: 'GlTable',
    img: '',
    description: '',
    show: true,
    bind: {opts: table, query: {}},
    meta: {
      component: 'GlTable',
      designer: 'GlIdePluginTableDesigner',
      title: '列表编辑器',
      objectTree: [
        {
          title: '查询栏',
          path: 'query.mix.properties'
        }, {
          title: '工具栏',
          path: 'toolbar.actions'
        }, {
          title: '列操作',
          path: 'table.rowAction.actions'
        }],
      // 该组件输入参数定义元数据
      inParam: {
        path: 'query.mix.properties',
        name: 'field',
        title: 'title'
      },
      // 该组件的输出参数定义元数据
      outParams: [{
        group: '行记录（currentRow）',
        type: Object,
        name: 'dataIndex', title: 'title', path: 'table.columns',
        dataCtx: 'currentRow'
      }],
      methods: [{code: 'refresh', title: '刷新', description: '刷新列表'}],
    }
  },
    {
      title: '表单',
      icon: 'form',
      component: 'GlForm',
      img: '',
      description: '',
      show: true,
      // 初始化的模板数据
      bind: {opts: form, query: {}},
      meta: {
        component: 'GlForm',
        designer: 'GlIdePluginFormDesigner',
        title: '表单编辑器',
        objectTree: [{title: '表单控件', path: 'properties'}],
        // 该组件输入参数
        inParam: {
          path: 'properties',
          name: 'field',
          title: 'title'
        }
      }
    }, {
      title: '页面引用',
      icon: 'link',
      component: 'GlPageLoader',
      img: '',
      description: '',
      show: true,
      bind: {opts: table, query: {}},
      meta: {component: 'GlPageLoader', designer: 'GlIdePluginPageLoaderDesigner', title: '设置'}
    }, {
      title: '工具条',
      icon: 'tool',
      component: 'GlToolbar',
      img: '',
      description: '',
      show: true,
      bind: {opts: {}, query: {}},
      meta: {component: 'GlToolbar', designer: 'GlIdePluginToolbarDesigner', title: '工具条设置'}
    },
    {
      title: '标题',
      icon: 'bars',
      component: 'GlHeader',
      img: '',
      description: '',
      show: true,
      bind: header,
      meta: {
        component: 'GlHeader',
        designer: 'GlIdePluginHeaderDesigner',
        title: '标题设置',
        objectTree: [],
        inSettingPanel: true
      }
    }],
}
