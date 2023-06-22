<!-- Login.vue -->
<template>
  <div class="mt-12 p-4">
    <!-- Back to home -->
    <router-link to="/" class="text-gray-500 hover:text-gray-700">
      <font-awesome-icon :icon="['fas', 'arrow-left']" />
      Back to home
    </router-link>
    <SpecialCard @card-click="authorize">
      <h2 class="font-bold text-sm">
        <font-awesome-icon :icon="['fas', 'lock']" />
        Login with Ducket
      </h2>
    </SpecialCard>
  </div>
</template>

<script>
import authService from "@/services/authService";
import SpecialCard from "../ui/SpecialCard.vue";

export default {
  components: {
    SpecialCard,
  },
  methods: {
    authorize() {
      authService.getAuthorizationCode();
    },
  },
};
</script>
