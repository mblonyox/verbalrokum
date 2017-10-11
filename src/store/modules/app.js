const state = {
  device: {
    isMobile: false,
    isTablet: false,
  },
  sidebar: false,
  loading: false,
};

const mutations = {
  setDevice(state, device) {
    state.device.isMobile = device === 'mobile';
    state.device.isTablet = device === 'tablet';
  },
  setSidebar(state, sidebar) {
    state.sidebar = sidebar;
  },
  setLoading(state, loading) {
    state.loading = loading;
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
