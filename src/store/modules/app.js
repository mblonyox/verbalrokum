const state = {
  device: {
    isMobile: false,
    isTablet: false,
  },
  sidebar: false,
  queue: 0,
  menus: [
    { title: 'Dashboard', icon: 'dashboard', route: '/' },
    'divider',
    { title: 'Rekam verbal', icon: 'add', route: '/verbal/rekam' },
    { title: 'Verbal', icon: 'assignment', route: '/verbal/all' },
    { title: 'Verbal selesai', icon: 'assignment_turned_in', route: '/verbal/selesai' },
    { title: 'Arsip verbal', icon: 'assignment_returned', route: '/verbal/arsip' },
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
