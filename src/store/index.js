import Vue from 'vue';
import Vuex from 'vuex';
import { firebaseMutations } from 'vuexfire';
import createPersistedState from 'vuex-persistedstate';

import auth from './modules/auth';
import app from './modules/app';
import verbal from './modules/verbal';
import { version } from '../../package.json';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    app,
    verbal,
  },
  mutations: {
    ...firebaseMutations,
  },
  plugins: [createPersistedState({
    key: `version-${version}`,
    paths: ['auth', 'app.sidebar'],
  })],
});
