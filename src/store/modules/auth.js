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
    commit('setPending', true);
    firebase.auth()
      .signInWithEmailAndPassword(credential.email, credential.password)
      .then(() => {
        commit('setPending', false);
      })
      .catch((error) => {
        commit('setError', error);
        commit('setPending', false);
      });
  },
  logout({ commit }) {
    commit('setPending', true);
    firebase.auth().signOut()
      .then(() => {
        commit('setPending', false);
      })
      .catch((error) => {
        commit('setError', error);
        commit('setPending', false);
      });
  },
  authChanged({ state, commit, dispatch }, user) {
    commit('setPending', true);
    dispatch('showSnackbar', {
      show: true,
      message: 'Memerika authentikasi.',
      color: 'info',
      timeout: 0,
    });
    if (!user) {
      dispatch('showSnackbar', {
        show: true,
        message: 'Autentikasi gagal, silakan login.',
        color: 'error',
        timeout: 3000,
      });
      commit('unsetUser');
      if (state.loggedIn) {
        commit('setLoggedIn', false);
        router.push('/auth/login');
      }
      commit('setPending', false);
    } else {
      firebase.database().ref(`/users/${user.uid}`).once('value', (snap) => {
        const userdata = snap.val();
        dispatch('showSnackbar', {
          show: true,
          message: `Autentikasi berhasil, selamat datang ${userdata.displayName}.`,
          color: 'success',
          timeout: 3000,
        });
        commit('setUser', { ...user, ...userdata });
        if (!state.loggedIn) {
          commit('setLoggedIn', true);
          router.push('/');
        }
        commit('setPending', false);
        dispatch('initFirebaseRef');
      });
    }
  },
};

export default {
  state,
  mutations,
  actions,
};
