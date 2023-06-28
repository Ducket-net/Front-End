<!-- src/components/Home.vue -->
<template>
  <div class="">
    <GameRoom room-id="game" :tilemap="tilemap" :with-controller="true" />
  </div>
</template>

<script>
import GameRoom from '@/components/GameRoom.vue';

export default {
  components: {
    GameRoom,
  },
  data() {
    return {
      tilemap: `
      xxxx
    x11111
    x11111
    x11111
    x11x11
    x11x11
        `,
    };
  },
  methods: {},
};
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
}

.game-room-container {
  /* position: sticky; */
  z-index: 9; /* Set a high z-index to ensure it's above the scrolling content */
  touch-action: none;
}

.item-catalog-container {
  flex-grow: 1; /* Allow the catalog container to fill the remaining space */
  overflow-y: auto; /* Allow vertical scroll */
  -webkit-overflow-scrolling: touch; /* Enable smooth scrolling on iOS */
}
</style>
