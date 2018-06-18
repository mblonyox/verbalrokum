const state = {
  device: {
    isMobile: false,
    isTablet: false,
  },
  sidebar: false,
  pending: true,
  snackbar: {
    show: false,
    message: '',
    timeout: 3000,
    color: null,
  },
};

const mutations = {
  setDevice(state, device) {
    state.device.isMobile = device === 'mobile';
    state.device.isTablet = device === 'tablet';
  },
  setSidebar(state, sidebar) {
    state.sidebar = sidebar;
  },
  setPending(state, isPending) {
    state.pending = isPending;
  },
  setSnackbar(state, snackbar) {
    state.snackbar = snackbar;
  },
};

const getters = {
  isLoading(state) {
    return state.pending;
  },
  isMiniSidebar(state) {
    return !state.device.isMobile && !state.sidebar;
  },
  isHiddenSidebar(state) {
    return state.device.isMobile && !state.sidebar;
  },
};

const actions = {
  toggleSidebar({ state, commit }) {
    commit('setSidebar', !state.sidebar);
  },
  clearSnackbar({ commit }) {
    return new Promise((resolve) => {
      commit('setSnackbar', {
        show: false,
        message: '',
        timeout: 3000,
        color: null,
      });
      resolve();
    });
  },
  showSnackbar({ state, commit, dispatch }, snackbar) {
    dispatch('clearSnackbar')
      .then(() => {
        commit('setSnackbar', snackbar);
      });
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};
