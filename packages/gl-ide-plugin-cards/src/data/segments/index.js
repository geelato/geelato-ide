import segment1 from "./segment1";

export default {
  items: [
    {
      group: '模板片段',
      title: '模板',
      icon: 'code',
      component: 'GlSegment',
      img: '',
      description: '',
      show: true,
      bind: {opts: segment1.opts, params: {}},
      meta: segment1.meta
    }
  ]
}
