export const createNotification = (message) => {
  let title = process.env.NOTIFICATIONS_APP_TITLE || 'Slack Lite',
    options = {
      body: message,
      icon: process.env.NOTIFICATIONS_ICON_URL || 'https://assets.brandfolder.com/4eenloyz/original/Slack_Mark_Black_Web.png'
    }
  return new Notification(title, options)
}
