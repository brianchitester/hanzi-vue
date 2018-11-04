'use strict'
module.exports = {
  NODE_ENV: '"production"',
  VUE_APP_API_KEY: JSON.stringify(process.env.VUE_APP_API_KEY),
  VUE_APP_AUTH_DOMAIN: JSON.stringify(process.env.VUE_APP_AUTH_DOMAIN),
  VUE_APP_DATABASE_URL: JSON.stringify(process.env.VUE_APP_DATABASE_URL),
  VUE_APP_PROJECT_ID: JSON.stringify(process.env.VUE_APP_PROJECT_ID),
  VUE_APP_STORAGE_BUCKET: JSON.stringify(process.env.VUE_APP_STORAGE_BUCKET),
  VUE_APP_MESSAGING_SENDER_ID: JSON.stringify(process.env.VUE_APP_MESSAGING_SENDER_ID)
}
