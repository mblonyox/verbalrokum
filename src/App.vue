<template>
  <div id="app">
    <router-view/>
    <app-spinner/>
  </div>
</template>

<script>
import AppSpinner from '@/components/AppSpinner';

export default {
  components: {
    AppSpinner,
  },
  created() {
    this.$store.commit('resetQueue');
    this.$store.dispatch('initTujuanRef');
    this.$store.dispatch('initVerbalRef');
    this.$store.dispatch('initBagianPegawai');
  },
};
</script>


<style lang="stylus">
  @import './stylus/main'
</style>
