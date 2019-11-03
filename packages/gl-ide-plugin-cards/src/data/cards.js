import form from './form.js'
import table from './table.js'

export default {
  items: [{
    title: '表单',
    icon: 'form',
    component: 'GlForm',
    img: '',
    description: '',
    show: true,
    bind: {opts: form, query: {}},
    meta: {
      component: 'GlIdePluginFormDesigner',
      title: '表单编辑器',
      objectTree: [{title: '表单控件', path: 'properties'}]
    }
  }, {
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
      objectTree: [{title: '查询栏', path: 'query.mix.properties'}, {title: '工具栏', path: 'toolbar.actions'}],
      methods: [{code: 'refresh', title: '刷新', description: '刷新列表'}]
    }
  }, {
    title: '页面引用',
    icon: 'link',
    component: 'GlPageLoader',
    img: '',
    description: '',
    show: true,
    bind: {opts: table, query: {}},
    meta: {component: 'GlIdePluginPageloaderDesigner', title: '设置'}
  }, {
    title: '工具条',
    icon: 'tool',
    component: 'GlToolbar',
    img: '',
    description: '',
    show: true,
    bind: {opts: table, query: {}},
    meta: {component: 'GlIdePluginToolbarDesigner', title: '工具条设置'}
  },
    {
      title: '标题',
      icon: 'bars',
      component: 'GlHeader',
      img: '',
      description: '',
      show: true,
      bind: {opts: table, query: {}},
      meta: {component: 'GlIdePluginHeaderDesigner', title: '工具条设置', inSettingPanel: true}
    }],
}
