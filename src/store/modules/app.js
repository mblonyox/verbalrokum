const state = {
  device: {
    isMobile: false,
    isTablet: false,
  },
  sidebar: false,
  loading: false,
  menus: [
    { title: 'Dashboard', icon: 'dashboard', route: '/' },
    'divider',
    { title: 'Verbal aktif', icon: 'assignment', route: '/verbal' },
    { title: 'Verbal selesai', icon: 'assignment_turned_in', route: '/selesai' },
    { title: 'Arsip verbal', icon: 'assignment_returned', route: '/arsip' },
    'divider',
    { title: 'Laporan', icon: 'book', route: '/laporan' },
    { title: 'Statistik', icon: 'trending_up', route: '/statistik' },
    'divider',
    { title: 'Pengaturan', icon: 'settings', route: '/settings' },
    { title: 'Saran', icon: 'feedback', route: '/feedback' },
    { title: 'Bantuan', icon: 'help', route: '/help' },
  ],
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
