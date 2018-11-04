// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase'

Vue.config.productionTip = false

let app;
let config = {
  VUE_APP_API_KEY: process.env.VUE_APP_API_KEY,
  VUE_APP_AUTH_DOMAIN: process.env.VUE_APP_AUTH_DOMAIN ,
  VUE_APP_DATABASE_URL: process.env.VUE_APP_DATABASE_URL ,
  VUE_APP_PROJECT_ID: process.env.VUE_APP_PROJECT_ID ,
  VUE_APP_STORAGE_BUCKET: process.env.VUE_APP_STORAGE_BUCKET ,
  VUE_APP_MESSAGING_SENDER_ID: process.env.VUE_APP_MESSAGING_SENDER_ID
};

firebase.initializeApp(config)

firebase.auth().onAuthStateChanged(function(user) {
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      el: '#app',
      template: '<App/>',
      components: { App },
      router
    })
  }
});

const firestore = firebase.firestore();
const settings = {timestampsInSnapshots: true};
firestore.settings(settings);
