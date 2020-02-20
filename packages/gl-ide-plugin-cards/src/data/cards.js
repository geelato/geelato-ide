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
      component: 'GlIdePluginTableDesigner',
      title: '列表编辑器',
      objectTree: [{title: '查询栏', path: 'query.mix.properties'}, {title: '工具栏', path: 'toolbar.actions'}, {
        title: '列操作',
        path: 'table.rowAction.actions'
      }],
      methods: [{code: 'refresh', title: '刷新', description: '刷新列表'}]
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
        component: 'GlIdePluginFormDesigner',
        title: '表单编辑器',
        objectTree: [{title: '表单控件', path: 'properties'}]
      }
    }, {
      title: '页面引用',
      icon: 'link',
      component: 'GlPageLoader',
      img: '',
      description: '',
      show: true,
      bind: {opts: table, query: {}},
      meta: {component: 'GlIdePluginPageLoaderDesigner', title: '设置'}
    }, {
      title: '工具条',
      icon: 'tool',
      component: 'GlToolbar',
      img: '',
      description: '',
      show: true,
      bind: {opts: {}, query: {}},
      meta: {component: 'GlIdePluginToolbarDesigner', title: '工具条设置'}
    },
    {
      title: '标题',
      icon: 'bars',
      component: 'GlHeader',
      img: '',
      description: '',
      show: true,
      bind: header,
      meta: {component: 'GlIdePluginHeaderDesigner', title: '标题设置', objectTree: [], inSettingPanel: true}
    }],
}
