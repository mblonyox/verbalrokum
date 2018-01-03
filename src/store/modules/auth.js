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
    commit('addQueue');
    firebase.auth()
      .signInWithEmailAndPassword(credential.email, credential.password)
      .then(() => {
        commit('removeQueue');
      })
      .catch((error) => {
        commit('setError', error);
        commit('removeQueue');
      });
  },
  logout({ commit }) {
    commit('addQueue');
    firebase.auth().signOut()
      .then(() => {
        commit('removeQueue');
      })
      .catch((error) => {
        commit('setError', error);
        commit('removeQueue');
      });
  },
  authChanged({ state, commit, dispatch }, user) {
    commit('addQueue');
    if (!user) {
      commit('unsetUser');
      if (state.loggedIn) {
        commit('setLoggedIn', false);
        router.push('/auth/login');
      }
      commit('removeQueue');
    } else {
      firebase.database().ref(`/users/${user.uid}`).once('value', (snap) => {
        const userdata = snap.val();
        commit('setUser', { ...userdata, ...user });
        if (!state.loggedIn) {
          commit('setLoggedIn', true);
          router.push('/');
        }
        dispatch('initAllRef');
        commit('removeQueue');
      });
    }
  },
};

export default {
  state,
  mutations,
  actions,
};
