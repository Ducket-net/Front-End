<!-- Login.vue -->
<template>
  <div class="mt-12 p-4 text-white">
    <!-- Back to home -->
    <router-link to="/" class="text-gray-500 hover:text-gray-700">
      <font-awesome-icon :icon="['fas', 'arrow-left']" />
      Back to home
    </router-link>

    <div v-if="isUserLoggedIn">
      <h1 class="text-3xl font-bold mb-4">
        Welcome {{ loggedInUser.user.name }}!
      </h1>
      <p class="text-gray-500">
        You can now create rooms and chat with other users.
      </p>

      <SpecialButton @button-click="logout" buttonClass="w-full">
        <font-awesome-icon :icon="['fas', 'sign-out-alt']" />
        Logout
      </SpecialButton>
    </div>
    <div v-else>
      <SpecialButton @button-click="authorize" buttonClass="w-full">
        <font-awesome-icon :icon="['fas', 'lock']" />
        Login with Ducket
      </SpecialButton>
    </div>
  </div>
</template>

<script>
import authService from '@/services/authService';
import SpecialCard from '@/components/SpecialCard.vue';
import SpecialButton from '@/components/SpecialButton.vue';

export default {
  components: {
    SpecialCard,
    SpecialButton,
  },
  methods: {
    authorize() {
      authService.getAuthorizationCode();
    },
    logout() {
      authService.logout();
    },
  },
};
</script>
