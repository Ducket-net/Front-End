<!-- src/components/Home.vue -->
<template>
  <div>
    <h1>Welcome to Suite... Coming soon</h1>
    <GameRoom room-id="home" />
    <div class="mx-auto max-w-sm max-h-52 overflow-y-scroll">
      <ItemCatalog />
    </div>
  </div>
</template>

<script>
import GameRoom from "./GameRoom.vue";
import ItemCatalog from "./ItemCatalog.vue";

export default {
  components: {
    GameRoom,
    ItemCatalog,
  },
  data() {
    return {
      home: "home",
      cake: "cake",
    };
  },
};
</script>
