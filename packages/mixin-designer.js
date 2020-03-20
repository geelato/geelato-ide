/**
 *  各组件设计器的公共默认样式设置
 */
export default {
  props: {
    /**
     * tab size
     */
    size: {
      type: String,
      default() {
        return 'small'
      }
    },
    height: {
      type: Number,
      default() {
        return window.innerHeight * .84
      }
    },
    tabPanelStyle: {
      type: Object,
      default() {
        return {
          'height': '100%',
          'min-height': window.innerHeight * .84 - 48 + 'px',
          'max-height': window.innerHeight * .84 - 48 + 'px',
          'overflow-y': "auto"
        }
      }
    }
  }
}
