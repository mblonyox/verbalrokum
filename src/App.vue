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
};
</script>


<style lang="stylus">
  @import './stylus/main'
</style>
