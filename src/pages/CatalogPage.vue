<!-- src/components/Home.vue -->
<template>
  <div>
    <div class="mt-10">
      <FurniCatalog :index="1" :search="search" />
    </div>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  height: 100vh; /* Set the container height to the screen height */
}

.game-room-container {
  /* position: sticky; */
  top: 0; /* Stick the GameRoom component to the top of the viewport */
  z-index: 9; /* Set a high z-index to ensure it's above the scrolling content */
  touch-action: none;
}

.item-catalog-container {
  flex-grow: 1; /* Allow the catalog container to fill the remaining space */
  overflow-y: auto; /* Allow vertical scroll */
  -webkit-overflow-scrolling: touch; /* Enable smooth scrolling on iOS */
}
</style>

<script>
import { EventBus } from '@/eventBus';
import FurniCatalog from '@/components/FurniCatalog.vue';

export default {
  components: {
    FurniCatalog,
  },
  data() {
    return {
      search: {},
      itemCatalogOpen: true,
    };
  },
  methods: {
    emitSettings() {
      EventBus.$emit('item-settings');
    },
  },
};
</script>
