<template>
  <v-toolbar app fixed clipped-left color="light-blue">
    <v-toolbar-side-icon @click.stop="toggleSidebar"></v-toolbar-side-icon>
    <v-toolbar-title>Verbal Rokum</v-toolbar-title>
  </v-toolbar>
</template>

<script>
export default {
  methods: {
    toggleSidebar() {
      this.$store.dispatch('toggleSidebar');
    },
  },
};
</script>
