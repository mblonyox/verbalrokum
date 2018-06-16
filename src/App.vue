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
  beforeMount() {
    const { body } = document;
    const WIDTH = 768;
    const RATIO = 3;

    const handler = () => {
      if (!document.hidden) {
        const rect = body.getBoundingClientRect();
        const isMobile = rect.width - RATIO < WIDTH;
        this.$store.commit('setDevice', isMobile ? 'mobile' : 'other');
        // this.$store.commit('setSidebar', !isMobile);
      }
    };

    document.addEventListener('visibilitychange', handler);
    window.addEventListener('DOMContentLoaded', handler);
    window.addEventListener('resize', handler);
  },
};
</script>


<style lang="stylus">
  @import './stylus/main'
</style>
