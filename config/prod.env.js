'use strict'
module.exports = {
  NODE_ENV: '"production"',
  apiKey: JSON.stringify(process.env.apiKey),
  authDomain: JSON.stringify(process.env.authDomain),
  databaseURL: JSON.stringify(process.env.databaseURL),
  projectId: JSON.stringify(process.env.projectId),
  storageBucket: JSON.stringify(process.env.storageBucket),
  messagingSenderId: JSON.stringify(process.env.messagingSenderId)
}
