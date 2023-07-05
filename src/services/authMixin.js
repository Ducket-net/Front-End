// src/globalMixin.js
export default {
  install(app) {
    app.mixin({
      computed: {
        isUserLoggedIn() {
          return this.$store.getters.isUserLoggedIn;
        },
        loggedInUser() {
          return this.$store.getters.loggedInUser;
        },
      },
    });
  },
};
