<!-- src/components/Home.vue -->
<template>
  <div class="home-container">
    <div class="game-room-container">
      <GameRoom room-id="home" />
    </div>

    <div class="grid grid-rows-3 text-white gap-2 py-2">
      <div class="bg-black p-3 rounded-lg">
        <h2 class="font-bold text-sm">Manage Room</h2>
        <p class="text-sm text-gray-300">
          Clicking on the <font-awesome-icon :icon="['fas', 'gear']" /> allows
          you to manage your rooms walls, floors, colors and other settings!
        </p>
      </div>

      <div class="bg-black p-3 rounded-lg">
        <h2 class="text-bold">Manage Room</h2>
        <p class="text-sm text-gray-300">
          Clicking on the <font-awesome-icon :icon="['fas', 'gear']" /> allows
          you to manage your rooms walls, floors, colors and other settings!
        </p>
      </div>

      <div class="bg-black p-3 rounded-lg">
        <h2 class="text-bold">Manage Room</h2>
        <p class="text-sm text-gray-300">
          Clicking on the <font-awesome-icon :icon="['fas', 'gear']" /> allows
          you to manage your rooms walls, floors, colors and other settings!
        </p>
      </div>
    </div>

    <div class="item-catalog-container no-scrollbar" @scroll.passive="onScroll">
      <ItemCatalogContainer />
      <footer
        class="mt-36 mx-auto text-white my-12 text-center max-w-sm text-xs"
      >
        <div class="block py-2">
          <a
            href="https://twitter.com/wes_wim"
            target="_blank"
            class="underline text-white"
            >Twitter</a
          >
          |
          <a href="" class="underline text-white"
            >Reload <font-awesome-icon :icon="['fas', 'sync-alt']" />
          </a>
        </div>
        Ducket is not affiliated with, endorsed, sponsored, or specifically
        approved by Sulake Corporation Oy or its Affiliates. Ducket may use the
        trademarks and other intellectual property of Habbo, which is permitted
        under Habbo Fan Site Policy.
      </footer>
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
      roomSettingsOpen: false,
    };
  },
  methods: {
    onScroll(event) {
      const { target } = event;
      // Check if the user scrolls down
      if (target.scrollTop > 0) {
        this.$root.$emit("hide-header", target.scrollTop);
      }
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
  },
};
</script>
