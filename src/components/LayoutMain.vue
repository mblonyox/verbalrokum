<template>
  <v-app id="main-layout">
    <MainSidebar/>
    <MainToolbar/>
    <router-view/>
  </v-app>
</template>

<script>
import MainSidebar from './layout/MainSidebar';
import MainToolbar from './layout/MainToolbar';

export default {
  components: {
    MainSidebar,
    MainToolbar,
  },
};
</script>
