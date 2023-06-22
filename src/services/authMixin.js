import Vue from "vue";

Vue.mixin({
  computed: {
    isUserLoggedIn() {
      return this.$store.getters.isUserLoggedIn;
    },
    loggedInUser() {
      return this.$store.getters.loggedInUser;
    },
  },
});
