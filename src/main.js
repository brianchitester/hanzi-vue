// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase'

Vue.config.productionTip = false

let app;
const config = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN ,
  databaseURL: process.env.VUE_APP_DATABASE_URL ,
  projectId: process.env.VUE_APP_PROJECT_ID ,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET ,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID
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
