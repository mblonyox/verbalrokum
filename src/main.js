// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuetify from 'vuetify';
import firebase from 'firebase';
import App from './App';
import router from './router';
import store from './store';
import firebaseConfig from './config/firebase';

firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged((user) => {
  store.dispatch('authChanged', user);
});

router.beforeEach((to, from, next) => {
  if (store.state.app.device.isMobile && store.state.app.sidebar) {
    store.commit('setSidebar', false);
  }

  if (to.matched.some(record => record.meta.requiresAuth) && !store.state.auth.loggedIn) {
    next('/auth/login');
  } else
  if (to.matched.some(record => record.meta.requiresAuth === false) && store.state.auth.loggedIn) {
    next('/');
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
