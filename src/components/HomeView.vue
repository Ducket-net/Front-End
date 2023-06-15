<!-- src/components/Home.vue -->
<template>
  <div class="home-container">
    <div class="game-room-container">
      <GameRoom room-id="home" />
    </div>

    <div
      class="item-catalog-container no-scrollbar bg-[#1A1F25]"
      @scroll.passive="onScroll"
    >
      <ItemCatalogContainer />
      <div class="grid text-black gap-4 py-4 p-4 grid-cols-2 mt-10">
        <div
          class="bg-white border-1 border border-black p-4 rounded-xl"
          @click="emitSettings()"
        >
          <h2 class="font-bold text-sm">
            <font-awesome-icon :icon="['fas', 'gear']" />
            Manage Room
          </h2>
          <p class="text-sm text-gray-700">
            Edit the background, floors, positions and more.
          </p>
        </div>

        <div class="bg-white border-1 border border-black p-4 rounded-xl">
          <h2 class="font-bold text-sm">
            <font-awesome-icon :icon="['fas', 'arrow-up-from-bracket']" />
            Install the App
          </h2>
          <p class="text-sm text-gray-700">
            Click the share icon
            <font-awesome-icon :icon="['fas', 'arrow-up-from-bracket']" /> and
            then Add to Home Screen.
          </p>
        </div>

        <div class="bg-white border-1 border border-black p-4 rounded-xl">
          <h2 class="font-bold text-sm">
            <font-awesome-icon :icon="['fas', 'bug']" /> Report Bugs & Issues
          </h2>
          <p class="text-sm text-gray-700">
            If you find any bugs, report them to
            <a
              href="https://twitter.com/wes_wim"
              target="_blank"
              class="underline text-black"
              >Wes</a
            >
            on Twitter!
          </p>
        </div>
      </div>
      <footer
        class="mt-10 mx-auto text-white my-12 text-center max-w-sm text-xs"
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
        <p class="text-gray-500">
          Ducket is not affiliated with, endorsed, sponsored, or specifically
          approved by Sulake Corporation Oy or its Affiliates. Ducket may use
          the trademarks and other intellectual property of Habbo, which is
          permitted under Habbo Fan Site Policy.
        </p>
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
import { EventBus } from "@/eventBus";

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
    emitSettings() {
      EventBus.$emit("item-settings");
    },
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
