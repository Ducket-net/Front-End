<template>
  <div class="h-96 flex justify-center items-center text-white">
    <div class="text-center">
      <h1 class="text-3xl font-bold mb-4">Logging you out...</h1>
      <p class="text-gray-500">Please wait while we log you out.</p>
    </div>
  </div>
</template>

<script>
import authService from '@/services/authService';

export default {
  components: {},
  mounted() {
    authService.logout();
    setTimeout(() => {}, 2000);
  },
};
</script>
