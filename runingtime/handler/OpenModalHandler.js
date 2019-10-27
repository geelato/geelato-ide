export default class OpenModalHandler {

  constructor($root) {
    this.$root = $root
  }

  doAction(action) {
    // this.$root.$message[action.params.method](action.params.content, action.params.duration)
    console.log('gl-ide > OpenModalHandler.js > action:', action)
    this.$root.$gl.ui.openModal(this, {
      title: action.params.title,
      width: action.params.width || '1000px',
      height: action.params.height || '480px',
      body: {
        type: 'dynamic',
        component: 'GlPage',
        props: {
          extendId: action.params.pageId
        }
      }
    })
  }

}
