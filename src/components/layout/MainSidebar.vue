<template>
  <v-navigation-drawer disable-resize-watcher disable-route-watcher clipped app :mini-variant="miniSidebar" :value="showSidebar">
    <v-list class="pt-0">
      <template v-for="item in menus">
        <v-divider v-if="item === 'divider'" />
        <v-list-tile :to="item.route" exact v-else>
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
    <v-divider/>
    <div class="copyright">
      <b>© 2018 Sukirno</b>
      <p>Versi: {{version}}</p>
    </div>
  </v-navigation-drawer>
</template>

<script>
import { version } from '../../../package.json';

export default {
  data() {
    return {
      menus: [
        { title: 'Dashboard', icon: 'dashboard', route: '/' },
        'divider',
        { title: 'Rekam verbal', icon: 'add', route: '/verbal/rekam' },
        { title: 'Daftar Verbal', icon: 'assignment', route: '/verbal' },
        'divider',
        { title: 'Laporan', icon: 'book', route: '/laporan' },
        { title: 'Statistik', icon: 'trending_up', route: '/statistik' },
        'divider',
        { title: 'Pengaturan', icon: 'settings', route: '/settings' },
        { title: 'Saran', icon: 'feedback', route: '/feedback' },
        { title: 'Bantuan', icon: 'help', route: '/help' },
      ],
      version,
    };
  },
  computed: {
    miniSidebar() {
      return this.$store.getters.isMiniSidebar;
    },
    showSidebar() {
      return !this.$store.getters.isHiddenSidebar;
    },
  },
};
</script>

<style lang="css">
.navigation-drawer--mini-variant .copyright {
  display: none;
}

div.copyright {
  position: absolute;
  bottom: 0px;
  left: 10px;
}
</style>
