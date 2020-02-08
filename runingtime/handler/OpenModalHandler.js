export default class OpenModalHandler {

  constructor($root) {
    this.$root = $root
  }

  doAction(config, ctx) {
    console.log('gl-ide > OpenModalHandler.js > config:', config)
    this.$root.$gl.ui.openModal(ctx, {
      title: config.params.title,
      width: config.params.width || '1000px',
      height: config.params.height || '480px',
      body: {
        type: 'dynamic',
        component: 'GlPage',
        props: {
          extendId: config.params.pageId
        }
      },
      actions: config.params.actions,
      actionAlign: 'center',
      on: [{fn: 'save', ctx: 'content', then: {fn: 'close', ctx: 'this', then: {fn: 'refresh', ctx: 'opener'}}}],
    })
  }
}
