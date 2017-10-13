<template>
  <v-navigation-drawer persistent clipped app v-model="sidebar">
    <v-list class="pt-0">
      <template v-for="item in menus">
        <v-divider v-if="item === 'divider'" />
        <v-list-tile v-else>
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  computed: {
    menus() {
      return this.$store.state.app.menus;
    },
    sidebar: {
      get() {
        return this.$store.state.app.sidebar;
      },
      set(val) {
        this.$store.commit('setSidebar', val);
      },
    },
  },
};
</script>
