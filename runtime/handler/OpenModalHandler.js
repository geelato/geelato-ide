export default class OpenModalHandler {

  constructor($root) {
    this.$root = $root
  }

  doAction(action, ctx, data) {
    console.log('geelato > runtime > OpenModalHandler.js > doAction() > action:', action)
    console.log('geelato > runtime > OpenModalHandler.js > doAction() > ctx:', ctx)
    console.log('geelato > runtime > OpenModalHandler.js > doAction() > data:', data)
    this.$root.$gl.ui.openModal(ctx, {
      title: action.params.title,
      width: action.params.width || '1000px',
      height: action.params.height || '480px',
      body: {
        type: 'dynamic',
        component: 'GlPage',
        props: {
          extendId: action.params.pageId,
          query: data
        }
      },
      actions: action.params.actions,
      actionAlign: 'center',
      on: [{fn: 'save', ctx: 'content', then: {fn: 'close', ctx: 'this', then: {fn: 'refresh', ctx: 'opener'}}}],
    })
  }
}
