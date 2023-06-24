<!-- Login.vue -->
<template>
  <div>
    <GameRoom roomId="home" />

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
