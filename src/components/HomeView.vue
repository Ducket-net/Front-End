<!-- src/components/Home.vue -->
<template>
  <div>
    <GameRoom room-id="home" />
    <ItemCatalogContainer />
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
