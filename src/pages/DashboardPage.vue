<!-- Login.vue -->
<template>
  <div>
    <div class="text-white text-center z-50 relative top-14">
      <h1 class="text-lg font-bold">Welcome to Ducket</h1>
      <p class="text-sm w-48 mx-auto">
        Play Games and Buld your Pixel Creations!
      </p>
    </div>
    <div class="relative">
      <GameRoom roomId="home" size="small" />

      <div class="absolute bottom-2/4 left-36 right-0">
        <ChatContainer />
      </div>
    </div>

    <div class="p-4 grid grid-flow-row gap-4">
      <SpecialCard @card-click="createPage">
        <h2 class="font-bold text-sm">
          <font-awesome-icon :icon="['fas', 'square']" />
          Create
        </h2>
      </SpecialCard>
      <SpecialCard @card-click="createSmallPage">
        <h2 class="font-bold text-sm">
          <font-awesome-icon :icon="['fas', 'square']" />
          Create Small
        </h2>
      </SpecialCard>

      <div v-if="!$store.state.user">
        <SpecialCard @card-click="authorize">
          <h2 class="font-bold text-sm">
            <font-awesome-icon :icon="['fas', 'lock']" />
            Login with Ducket
          </h2>
        </SpecialCard>
      </div>

      <!-- 
      <SpecialCard>
        <h2 class="font-bold text-sm">
          <font-awesome-icon :icon="['fas', 'arrow-up-from-bracket']" />
          Add to Home Screen to Install the App
        </h2>
      </SpecialCard>

      <SpecialCard>
        <h2 class="font-bold text-sm">
          <font-awesome-icon :icon="['fas', 'bug']" /> Report Bugs & Issues
        </h2>
      </SpecialCard> -->
    </div>
  </div>
</template>

<script>
import authService from '@/services/authService';
import GameRoom from '@/components/GameRoom.vue';
import SpecialCard from '@/components/SpecialCard.vue';
import ChatContainer from '@/components/ChatContainer.vue';

export default {
  components: {
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
  },
};
</script>
