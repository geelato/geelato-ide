let component = {
  name: 'GlTag',
  render: function (createElement) {
    let that = this
    function create(tag) {
      console.log('tag:', tag, 'innerHTML:', !!tag.innerHTML, tag.innerHTML)
      let name = tag.name
      let domProps = {}
      let on = {}
      // 如果是文本节点
      if (!/^\s*$/.test(tag.innerHTML)) {
        domProps = {
          innerHTML: tag.innerHTML
        }
        on = {
          click: function (event) {
            that.$gl.bus.$emit('gl_ide_setting_open', {
              panelName: 'GlIdePluginLayoutSegmentSettings',
              config: tag
            })
          },
          blur: function (event) {
            event.target.setAttribute('contenteditable', false)
            tag.innerHTML = event.target.innerHTML
          },
          dblclick: function (event) {
            event.target.setAttribute('contenteditable', true)
          }
        }
      }

      return createElement(
        // 标签名称
        name,
        {
          'class': tag.class,
          style: tag.style,
          // props: props,
          domProps: domProps,
          attrs: tag.attrs,
          on: on
        },
        function subTags() {
          if (!tag.items || tag.items.length === 0) {
            return []
          }
          let subElements = []
          for (let subTagIndex in tag.items) {
            // subElements.push(create(tag.items[subTagIndex]))
            subElements.push(createElement('gl-tag', {props: {opts: tag.items[subTagIndex]}}))
          }
          return subElements
        }()
      )
    }

    return create(this.opts)
  },
  props: {
    opts: {
      type: Object,
      required: true
    }
  }
}

// 为组件提供 install 安装方法，供按需引入
component.install = function (Vue) {
  Vue.component(component.name, component)
}

// 默认导出组件
export default component
