/**
 *  强制刷新
 */
export default {
  data() {
    return {
      refreshFlag: true
    }
  },
  methods: {
    $_forceRefresh() {
      let that = this
      that.refreshFlag = false
      that.$nextTick(() => {
        that.refreshFlag = true
      })
    }
  }
}
