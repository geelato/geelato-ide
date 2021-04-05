import form from './form.js'
import toolbar from './toolbar.js'
import table from './table.js'
import tree from './tree.js'
import header from './header.js'
import pageLoader from './page_loader.js'
import controlButton from './control/button'
import container_tabs from './container_tabs'

export default {
  items: [{
    group: '容器',
    title: '标签容器',
    icon: 'read',
    componentName: 'GlContainerTabs',
    img: '',
    description: '',
    show: true,
    bind: {buildOpts: container_tabs.buildOpts, params: {}},
    meta: container_tabs.meta
  }, {
    group: '组件',
    title: '列表',
    icon: 'table',
    componentName: 'GlTable',
    img: '',
    description: '',
    show: true,
    bind: {opts: table.opts, params: {}},
    meta: table.meta
  },
    {
      group: '组件',
      title: '表单',
      icon: 'form',
      componentName: 'GlForm',
      img: '',
      description: '',
      show: true,
      // 初始化的模板数据
      bind: {buildOpts: form.buildOpts, params: {}},
      meta: form.meta
    },
    {
      title: '页面引用',
      icon: 'link',
      componentName: 'GlPage',
      img: '',
      description: '',
      show: true,
      bind: {opts: pageLoader.opts, params: {}},
      meta: pageLoader.meta
    },
    {
      group: '组件',
      title: '树',
      icon: 'cluster',
      componentName: 'GlTree',
      img: '',
      description: '',
      show: true,
      bind: {opts: tree.opts, params: {}},
      meta: tree.meta
    },
    {
      title: '工具条',
      icon: 'tool',
      componentName: 'GlToolbar',
      img: '',
      description: '',
      show: true,
      bind: {opts: toolbar.opts, params: {}},
      meta: toolbar.meta
    },
    // {
    //   group: '组件',
    //   title: '标题',
    //   icon: 'bars',
    //   componentName: 'GlHeader',
    //   img: '',
    //   description: '',
    //   show: true,
    //   bind: {opts: header.opts, params: {}},
    //   meta: header.meta
    // },
    {
      group: '控件',
      title: '按钮',
      icon: 'border',
      componentName: 'GlControl',
      img: '',
      description: '',
      show: true,
      bind: {opts: controlButton.opts, params: {}},
      meta: controlButton.meta
    }],
}
