<template>
  <v-navigation-drawer persistent clipped app v-model="sidebar">
    <v-toolbar flat>
      <v-list>
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img src="" alt="no-pic">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>Username</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-toolbar>
  </v-navigation-drawer>
</template>

<script>
export default {
  computed: {
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
