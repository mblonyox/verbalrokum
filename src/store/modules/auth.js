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

export default {
  state,
  mutations,
};
