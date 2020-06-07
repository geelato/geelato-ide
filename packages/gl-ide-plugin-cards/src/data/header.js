export default {
  opts: {
    title: '标题',
    icon: 'plus-square',
    style: {
      // 'background-color': '#cccccc'
    },
    extra: {
      controls: [
        {
          control: 'button',
          title: '更多',
          props: {
            type: 'link',
            // ghost: 'true'
          }
        }
      ]
    }
  },
  meta: {
    component: 'GlHeader',
    designer: 'GlIdePluginHeaderDesigner',
    title: '标题设置',
    objectTree: [],
    inSettingPanel: true
  }
}
