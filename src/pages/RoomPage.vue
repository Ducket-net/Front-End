<!-- src/components/Home.vue -->
<template>
  <div class="home-container max-w-md">
    <div class="game-room-container overflow-hidden bg-[#1E1E1E]">
      <GameRoom room-id="blank" :withController="true" />
    </div>
    <div class="mt-[20px] m-2 rounded-lg">
      <FurniCatalog :index="1" />
    </div>
    <div class="item-catalog-container no-scrollbar"></div>
  </div>
</template>

<script>
import GameRoom from '@/components/GameRoom.vue';
import { EventBus } from '@/eventBus.js';
import FurniCatalog from '@/components/FurniCatalog.vue';

export default {
  components: {
    GameRoom,
    FurniCatalog,
  },
  data() {
    return {};
  },
  methods: {
    emitSettings() {
      EventBus.emit('item-settings');
    },
  },
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
  background-repeat: repeat;
  background-position: 38px 44px;
  background: url('../../public/6432-grid_2.png');
}

.item-catalog-container {
  flex-grow: 1; /* Allow the catalog container to fill the remaining space */
  overflow-y: auto; /* Allow vertical scroll */
  -webkit-overflow-scrolling: touch; /* Enable smooth scrolling on iOS */
}
</style>
