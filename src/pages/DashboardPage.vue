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

    <div class="p-4 grid grid-flow-row gap-4">
      <SpecialCard @card-click="$router.push('/create')">
        <h2 class="font-bold text-sm">
          <font-awesome-icon :icon="['fas', 'square']" />
          Create
        </h2>
      </SpecialCard>
      <SpecialCard @card-click="authorize">
        <h2 class="font-bold text-sm">
          <font-awesome-icon :icon="['fas', 'lock']" />
          Login with Ducket
        </h2>
      </SpecialCard>
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
  },
};
</script>
