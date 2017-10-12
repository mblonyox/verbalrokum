// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuetify from 'vuetify';
import firebase from 'firebase';
import App from './App';
import router from './router';
import store from './store';
import config from './firebase/config';

firebase.initializeApp(config);

firebase.auth().onAuthStateChanged((user) => {
  store.dispatch('authChanged', user);
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth) && !store.state.auth.loggedIn) {
    next('/auth/login');
  } else {
    next();
  }
});

Vue.use(Vuetify);
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});
