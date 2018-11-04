// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase'

Vue.config.productionTip = false

let app;
let config = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain ,
  databaseURL: process.env.databaseURL ,
  projectId: process.env.projectId ,
  storageBucket: process.env.storageBucket ,
  messagingSenderId: process.env.messagingSenderId
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
