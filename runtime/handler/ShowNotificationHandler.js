export default class ShowMessageHandler {

  constructor($root) {
    this.$root = $root
  }

  doAction(action, ctx, data) {
    // e.g.
    // this.$root.$notification.open({
    //   message: 'Notification Title',
    //   description:
    //     'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    //   onClick: () => {
    //     console.log('Notification Clicked!')
    //   },
    // })

    this.$root.$notification.open(action.params.ShowNotification)
  }
}
