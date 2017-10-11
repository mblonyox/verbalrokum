<template>
  <v-app id="main-layout">
    <MainSidebar/>
    <MainToolbar/>
    <main>
      <v-content>
        <v-container fluid>
          <router-view/>
        </v-container>
      </v-content>
    </main>
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
