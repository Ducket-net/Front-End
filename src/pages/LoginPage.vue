<!-- Login.vue -->
<template>
  <div class="text-white h-full">
    <!-- Back to home -->

    <div v-if="isUserLoggedIn">
      <Title
        :title="`Welcome ${loggedInUser.name}!`"
        subtitle="You are logged in."
      />
      <section class="pointer-events-none">
        <GameRoom roomId="login" size="xs" />
      </section>
      <div class="px-4">
        <SpecialButton @button-click="manage" buttonClass="w-full mb-2">
          Manage Account
        </SpecialButton>
        <SpecialButton @button-click="logout" buttonClass="w-full">
          <font-awesome-icon :icon="['fas', 'sign-out-alt']" />
          Logout
        </SpecialButton>
      </div>
    </div>
    <div v-else>
      <Title title="Welcome to Ducket" subtitle="Login to continue." />
      <section class="pointer-events-none">
        <GameRoom roomId="login" size="xs" />
      </section>
      <form
        class="flex flex-col h-56 justify-end -mt-12 p-4"
        @submit.prevent="login"
      >
        <div v-if="errorMessage" class="mt-4 text-red-500">
          {{ errorMessage }}
        </div>
        <div class="grid grid-rows-2 gap-10">
          <div v-if="showUsername" class="text-white text-sm">
            <label for="email" class="text-white text-sm pb-1.5 block">
              <font-awesome-icon :icon="['fas', 'envelope']" />
              Email
            </label>
            <input
              v-model="email"
              type="email"
              placeholder="Email"
              class="input-class text-black"
              required
            />
          </div>

          <transition name="fade">
            <div v-if="showPassword" class="text-white text-sm">
              <label for="email" class="text-white text-sm pb-1.5 block">
                <font-awesome-icon :icon="['fas', 'lock']" />
                Password
              </label>
              <input
                v-model="password"
                type="password"
                placeholder="Password"
                class="input-class text-black"
                required
              />
            </div>
          </transition>

          <SpecialButton buttonClass="w-full">
            <font-awesome-icon :icon="['fas', 'lock']" />
            <span class="ml-2">{{ showUsername ? 'Login' : 'Next' }}</span>
          </SpecialButton>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { useVuelidate } from '@vuelidate/core';
import authService from '@/services/authService';
import SpecialCard from '@/components/SpecialCard.vue';
import SpecialButton from '@/components/SpecialButton.vue';
import Title from '@/components/ui/Title.vue';
import { toRefs } from 'vue';
import GameRoom from '@/components/GameRoom.vue';

export default {
  setup() {
    const v$ = useVuelidate();
    return { ...toRefs(v$) }; // Use toRefs to make the Vuelidate state reactive
  },
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '', // Add this line
      showPassword: false,
      showUsername: true,
    };
  },
  components: {
    SpecialCard,
    SpecialButton,
    Title,
    GameRoom,
  },

  methods: {
    async login() {
      //Check if showUsername is true
      if (!this.showPassword) {
        this.showUsername = false;
        this.showPassword = true;
        return;
      }

      try {
        const login = await authService.login(this.email, this.password);
        setTimeout(() => {
          this.$router.push('/');
        }, 1000);
      } catch (error) {
        this.errorMessage = error.message;
        this.showUsername = true;
        this.showPassword = true;
      }
    },
    logout() {
      authService.logout();
    },
    manage() {
      location.href = `${process.env.VUE_APP_API_URL}/me/profile`;
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
