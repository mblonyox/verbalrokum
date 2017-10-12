<template>
  <v-toolbar app fixed clipped-left dark color="light-blue">
    <v-toolbar-title 
      class="white--text ml-0 pl-3"
      style="width:300px;"
    >
      <v-toolbar-side-icon @click.stop="toggleSidebar"/>
      Verbal Rokum
    </v-toolbar-title>
    <v-text-field
      solo
      prepend-icon="search"
      placeholder="Search"
    />
    <v-spacer/>
    <v-btn icon>
      <v-icon>apps</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon>notifications</v-icon>
    </v-btn>
    <v-menu
      offset-y
    >
      <v-btn icon dark slot="activator">
        <v-icon>account_circle</v-icon>
      </v-btn>
      <v-card>
        <v-card-title primary-title>
          <v-avatar>
            <img :src="user.photoURL" alt="profile-photo">
          </v-avatar>
          <div>
            <span class="title">{{user.displayName}}</span><br>
            <span class="subheading">{{user.email}}</span>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn @click.stop="doLogout">Log out</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </v-toolbar>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.state.auth.user;
    },
  },
  methods: {
    toggleSidebar() {
      this.$store.dispatch('toggleSidebar');
    },
    doLogout() {
      this.$store.dispatch('logout');
    },
  },
};
</script>
