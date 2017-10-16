import Vue from 'vue';
import Vuex from 'vuex';
import { firebaseMutations } from 'vuexfire';

import auth from './modules/auth';
import app from './modules/app';
import verbal from './modules/verbal';

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
});
