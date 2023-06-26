<!-- Login.vue -->
<template>
  <div>
    <div class="text-white text-center z-50 relative top-14">
      <h1 class="text-lg font-bold">Welcome to Ducket</h1>
      <p class="text-sm w-48 mx-auto">
        Play Games and Buld your Pixel Creations!
      </p>
    </div>
    <GameRoom roomId="home" size="small" />

    <div
      class="shadow-xl relative -top-32 rounded-full bg-red-500 p-[3px] grid grid-cols-[30px,auto] max-w-[200px] mx-auto mt-4 bg-gradient-to-bl from-red-400 to-red-800"
    >
      <div
        class="bg-gray-300 rounded-l-full border-2 border-gray-300 flex items-baseline"
      >
        <div
          class="bg-white h-6 w-6 rounded-full m-auto overflow-hidden border-2 border-white"
        >
          <img src="icons/frank.png" class="object-none" />
        </div>
      </div>
      <div class="bg-white rounded-r-full text-sm pl-2 p-1">Coming Soon!</div>
    </div>

    <div class="p-4 grid grid-flow-row gap-4">
      <!-- <SpecialCard @card-click="createPage">
        <h2 class="font-bold text-sm">
          <font-awesome-icon :icon="['fas', 'square']" />
          Create
        </h2>
      </SpecialCard> -->
      <SpecialCard @card-click="authorize">
        <h2 class="font-bold text-sm">
          <font-awesome-icon :icon="['fas', 'lock']" />
          Login with Ducket
        </h2>
      </SpecialCard>
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

export default {
  components: {
    SpecialCard,
    GameRoom,
  },
  methods: {
    authorize() {
      authService.getAuthorizationCode();
    },
    createPage() {
      location.href = '/create';
    },
  },
};
</script>
