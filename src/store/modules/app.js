const state = {
  device: {
    isMobile: false,
    isTablet: false,
  },
  sidebar: false,
  queue: 0,
};

const mutations = {
  setDevice(state, device) {
    state.device.isMobile = device === 'mobile';
    state.device.isTablet = device === 'tablet';
  },
  setSidebar(state, sidebar) {
    state.sidebar = sidebar;
  },
  addQueue(state) {
    state.queue += 1;
  },
  removeQueue(state) {
    if (state.queue > 0) state.queue -= 1;
  },
  resetQueue(state) {
    state.queue = 0;
  },
};

const getters = {
  isLoading(state) {
    return state.queue > 0;
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
