<!-- Login.vue -->
<template>
  <div>
    <title />
    <div class="relative">
      <GameRoom roomId="home" size="small" />

      <div class="absolute bottom-2/4 left-16 right-0">
        <ChatContainer />
      </div>
    </div>

    <div class="p-4 grid grid-flow-row grid-cols-2 gap-4">
      <SpecialCard @card-click="createPage">
        <h2 class="font-bold text-sm">
          <font-awesome-icon :icon="['fas', 'bomb']" />
          <span class="pl-1">Create a Regular Room</span>
        </h2>
      </SpecialCard>
      <SpecialCard @card-click="createSmallPage">
        <h2 class="font-bold text-sm">
          <font-awesome-icon :icon="['fas', 'kiwi-bird']" />
          <span class="pl-1">Create a Mini Room</span>
        </h2>
      </SpecialCard>

      <SpecialCard @card-click="goPages">
        <h2 class="font-bold text-sm">
          <font-awesome-icon :icon="['fas', 'newspaper']" />
          <span class="pl-1">Wired</span>
        </h2>
      </SpecialCard>

      <div v-if="!$store.state.user">
        <SpecialCard @card-click="authorize">
          <h2 class="font-bold text-sm">
            <font-awesome-icon :icon="['fas', 'lock']" />
            <span class="pl-1">Login with Ducket</span>
          </h2>
        </SpecialCard>
      </div>

      <!-- 
      <SpecialCard>
        <h2 class="font-bold text-sm">
          <font-awesome-icon :icon="['fas', 'arrow-up-from-bracket']" />
          <span class="pl-1">Add to Home Screen to Install the App</span>
        </h2>
      </SpecialCard>

      <SpecialCard>
        <h2 class="font-bold text-sm">
          <font-awesome-icon :icon="['fas', 'bug']" /> Report Bugs & Issues
        </<span class="pl-1">h2></span>
      </SpecialCard> -->
    </div>
  </div>
</template>

<script>
import Title from '@/components/ui/Title.vue';

import authService from '@/services/authService';
import GameRoom from '@/components/GameRoom.vue';
import SpecialCard from '@/components/SpecialCard.vue';
import ChatContainer from '@/components/ChatContainer.vue';

export default {
  name: 'DashboardPage',
  components: {
    Title,
    SpecialCard,
    GameRoom,
    ChatContainer,
  },
  mounted() {
    setTimeout(() => {
      this.sendWelcomeMessage('👋 Welcome to Ducket!');
    }, 1000);

    setTimeout(() => {
      this.sendWelcomeMessage('Click Create to start building!');
    }, 4000);
    setTimeout(() => {
      this.sendWelcomeMessage('Your old favorites are in the catalog!');
    }, 7000);
  },
  methods: {
    sendWelcomeMessage(message) {
      this.$store.dispatch('sendMessage', {
        text: message,
        image: 'icons/frank.png',
        color: 'red',
      });
    },
    authorize() {
      authService.getAuthorizationCode();
    },
    createPage() {
      location.href = '/create';
    },
    createSmallPage() {
      location.href = '/createSmall';
    },
    goPages() {
      // location.href = '/pages';
      //Router
      this.$router.push('/wired');
    },
  },
};
</script>
