<!-- Login.vue -->
<template>
  <div class="mt-12 p-4">
    <!-- Back to home -->
    <GameRoom room-id="home" />
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
</template>

<script>
import authService from '../../services/authService';
import GameRoom from '../GameRoom.vue';
import SpecialCard from '../ui/SpecialCard.vue';

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
