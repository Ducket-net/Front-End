<!-- src/components/Home.vue -->
<template>
  <div>
    <GameRoom room-id="home" />
    <ItemCatalogContainer />
    <SettingsController />
  </div>
</template>

<script>
import GameRoom from "./GameRoom.vue";
import ItemCatalogContainer from "./ItemCatalogContainer.vue";
import SettingsController from "./SettingsController.vue";

export default {
  components: {
    GameRoom,
    ItemCatalogContainer,
    SettingsController,
  },
  data() {
    return {
      home: "home",
      cake: "cake",
      roomSettingsOpen: false,
    };
  },
  methods: {
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    clearLocalStorage() {
      //Confirm
      if (!confirm("Are you sure you want to reset all?")) return;
      localStorage.clear();
      location.reload();
    },
  },
};
</script>
