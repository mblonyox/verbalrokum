<template>
  <v-snackbar
    :timeout="snackbar.timeout"
    :color="snackbar.color"
    top
    v-model="showSnackbar"
    class="application"
  >
    {{snackbar.message}}
    <v-btn flat color="pink" @click.native="showSnackbar = false">Tutup</v-btn>
  </v-snackbar>
</template>

<script>
  export default {
    computed: {
      snackbar() {
        return this.$store.state.app.snackbar;
      },
      showSnackbar: {
        get() {
          return this.snackbar.show;
        },
        set(val) {
          if (!val) this.$store.dispatch('clearSnackbar');
        },
      },
    },
  };
</script>
