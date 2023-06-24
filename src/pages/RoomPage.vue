<!-- src/components/Home.vue -->
<template>
  <div class="home-container max-w-md">
    <div class="game-room-container fixed overflow-hidden">
      <GameRoom room-id="blank" withController="true" />
    </div>
    <div class="mt-[500px]">
      <FurniCatalog :index="1" />
    </div>
    <div class="item-catalog-container no-scrollbar">
      <ItemCatalogContainer />
      <div class="grid text-black gap-4 py-4 p-4 grid-cols-2 mt-4">
        <SpecialCard @card-click="$router.push('/login')">
          <h2 class="font-bold text-sm">
            <font-awesome-icon :icon="['fas', 'gear']" />
            Account
          </h2>
          <p v-if="isUserLoggedIn">Hello, {{ loggedInUser.name }}!</p>
          <p v-else>Hello, guest!</p>
        </SpecialCard>
        <SpecialCard @card-click="emitSettings">
          <h2 class="font-bold text-sm">
            <font-awesome-icon :icon="['fas', 'gear']" />
            Manage Room
          </h2>
          <p class="text-sm text-gray-700">
            Edit the background, floors, positions, and more.
          </p>
        </SpecialCard>

        <SpecialCard>
          <h2 class="font-bold text-sm">
            <font-awesome-icon :icon="['fas', 'arrow-up-from-bracket']" />
            Install the App
          </h2>
          <p class="text-sm text-gray-700">
            Click the share icon
            <font-awesome-icon :icon="['fas', 'arrow-up-from-bracket']" /> and
            then Add to Home Screen.
          </p>
        </SpecialCard>

        <SpecialCard @card-click="emitSettings">
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
        </SpecialCard>
      </div>
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
import GameRoom from '@/components/GameRoom.vue';
import ItemCatalogContainer from '@/components/ItemCatalogContainer.vue';
import SpecialCard from '@/components/SpecialCard.vue';
import { EventBus } from '@/eventBus.js';
import FurniCatalog from '@/components/FurniCatalog.vue';

export default {
  components: {
    GameRoom,
    SpecialCard,
    FurniCatalog,
    ItemCatalogContainer,
  },
  data() {
    return {
      home: 'home',
      cake: 'cake',
      itemCatalogOpen: false,
    };
  },
  methods: {
    emitSettings() {
      EventBus.$emit('item-settings');
    },
  },
};
</script>
