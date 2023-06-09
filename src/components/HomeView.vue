<!-- src/components/Home.vue -->
<template>
  <div>
    <GameRoom room-id="home" />
    <div class="mx-auto max-w-sm mb-10">
      <ItemCatalogContainer />
    </div>
    <div class="mx-auto max-w-sm pb-10">
      <button
        @click="clearLocalStorage"
        class="mx-auto text-gray-400 block w-full text-xs bg-opacity-10 mt-2 rounded-md hover:bg-opacity-20"
      >
        <font-awesome-icon :icon="['fas', 'trash']" /> Reset All
      </button>
    </div>
  </div>
</template>

<script>
import GameRoom from "./GameRoom.vue";
import ItemCatalogContainer from "./ItemCatalogContainer.vue";

export default {
  components: {
    GameRoom,
    ItemCatalogContainer,
  },
  data() {
    return {
      home: "home",
      cake: "cake",
    };
  },
  methods: {
    clearLocalStorage() {
      //Confirm
      if (!confirm("Are you sure you want to reset all?")) return;
      localStorage.clear();
      location.reload();
    },
  },
};
</script>
