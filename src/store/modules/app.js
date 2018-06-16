const state = {
  device: {
    isMobile: false,
    isTablet: false,
  },
  sidebar: false,
  pending: false,
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
};

export default {
  state,
  getters,
  mutations,
  actions,
};
