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
        return 500
      }
    },
    tabPanelStyle: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}