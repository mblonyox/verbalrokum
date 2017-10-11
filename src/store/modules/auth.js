import firebase from 'firebase';
import router from '@/router';

const state = {
  user: {
    uid: null,
    email: null,
    displayName: null,
    photoURL: null,
    roles: [],
    lastLogin: null,
  },
  loggedIn: false,
  error: null,
};

const mutations = {
  setUser(state, user) {
    if (user) {
      state.user.uid = user.uid;
      state.user.email = user.email;
      state.user.displayName = user.displayName;
      state.user.photoURL = user.photoURL;
    } else {
      state.user.uid = null;
      state.user.email = null;
      state.user.displayName = null;
      state.user.photoURL = null;
    }
  },
  setLoggedIn(state, isLoggedIn) {
    state.loggedIn = isLoggedIn;
  },
  setError(state, error) {
    state.error = error;
  },
};

const actions = {
  loginWithEmail({ commit }, credential) {
    commit('setLoading', true);
    firebase.auth()
      .signInWithEmailAndPassword(credential.email, credential.password)
      .catch((error) => {
        // eslint-disable-next-line
        console.error(error);
        commit('setError', error);
        commit('setLoading', false);
      });
  },
  logout({ commit }) {
    commit('setLoading', true);
    firebase.auth().signOut().catch((error) => {
      commit('setError', error);
      commit('setLoading', false);
    });
  },
  authChanged({ commit }, user) {
    commit('setUser', user);
    commit('setUser', !!user);
    commit('setLoading', false);
    router.push('/');
  },
};

export default {
  state,
  mutations,
  actions,
};
