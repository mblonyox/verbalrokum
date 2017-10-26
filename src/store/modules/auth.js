import firebase from 'firebase';
import router from '@/router';

const state = {
  user: {
    uid: null,
    email: null,
    displayName: null,
    photoURL: null,
    roles: {},
    lastLogin: null,
  },
  loggedIn: false,
  error: null,
};

const mutations = {
  setUser(state, user) {
    state.user.uid = user.uid;
    state.user.email = user.email;
    state.user.displayName = user.displayName;
    state.user.photoURL = user.photoURL;
    state.user.roles = user.roles;
    state.user.lastLogin = user.lastLogin;
  },
  unsetUser(state) {
    state.user.uid = null;
    state.user.email = null;
    state.user.displayName = null;
    state.user.photoURL = null;
    state.user.roles = {};
    state.user.lastLogin = null;
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
  authChanged({ state, commit, dispatch }, user) {
    if (!user) {
      commit('unsetUser');
      if (state.loggedIn) {
        commit('setLoggedIn', false);
        router.push('/auth/login');
      }
      commit('setLoading', false);
    } else {
      firebase.database().ref(`/users/${user.uid}`).once('value', (snap) => {
        const userdata = snap.val();
        commit('setUser', { ...userdata, ...user });
        if (!state.loggedIn) {
          commit('setLoggedIn', true);
          router.push('/');
        }
        commit('setLoading', false);
        dispatch('initBagianPegawai');
      });
    }
  },
};

export default {
  state,
  mutations,
  actions,
};
