<!-- AuthCallback.vue -->
<template>
  <div>Processing...</div>
</template>

<script>
import authService from "@/services/authService";

export default {
  async created() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (!code) {
      console.error("Error during authentication: Missing authorization code");
      return this.$router.push("/login");
    }

    try {
      const token = await authService.getAccessToken(code);
      if (!token) {
        throw new Error("Error getting access token");
      }

      const isAuthenticated = await this.$store.dispatch("authenticate", token);
      if (isAuthenticated) {
        this.$router.push("/");
      } else {
        throw new Error("User authentication failed");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      this.$router.push("/login");
    }
  },
};
</script>
