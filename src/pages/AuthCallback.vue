<!-- AuthCallback.vue -->
<template>
  <div class="h-96 flex justify-center items-center text-white">
    <div class="text-center">
      <h1 class="text-3xl font-bold mb-4">Authenticating...</h1>
      <p class="text-gray-500">Please wait while we authenticate you.</p>
    </div>
  </div>
</template>

<script>
import authService from '@/services/authService';

export default {
  async created() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (!code) {
      console.error('Error during authentication: Missing authorization code');
      return this.$router.push('/login');
    }

    try {
      const token = await authService.getAccessToken(code);
      if (!token) {
        throw new Error('Error getting access token');
      }

      const isAuthenticated = await this.$store.dispatch('authenticate', token);
      if (isAuthenticated) {
        this.$router.push('/login');
      } else {
        throw new Error('User authentication failed');
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      this.$router.push('/login');
    }
  },
};
</script>
