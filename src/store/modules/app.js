const state = {
  device: {
    isMobile: false,
    isTablet: false,
  },
  sidebar: false,
};

const mutations = {
  setDevice(state, device) {
    state.device.isMobile = device === 'mobile';
    state.device.isTablet = device === 'tablet';
  },
  setSidebar(state, sidebar) {
    state.sidebar = sidebar;
  },
};

const actions = {
  toggleSidebar({ state, commit }) {
    commit('setSidebar', !state.sidebar);
  },
};

export default {
  state,
  mutations,
  actions,
};
