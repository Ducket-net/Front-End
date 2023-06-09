<!-- src/components/GameRoom.vue -->
<template>
  <div ref="container" class="max-w-sm mx-auto">
    <!-- <h2>Room {{ roomId }}</h2> -->
    <div
      ref="canvasContainer"
      id="canvasContainer"
      class="relative w-full bg-black bg-opacity-5 rounded-md mx-auto"
      @keydown="handleKeydown"
      tabindex="0"
    >
      <div class="mx-auto">
        <canvas ref="canvas" class="mx-auto"></canvas>
      </div>
    </div>

    <game-controller :game="game"></game-controller>
    <room-items-list
      v-if="game && game.room"
      :roomItems="Array.from(game.room.roomObjects)"
    ></room-items-list>

    <button
      @click="clearRoomItems"
      class="p-2 mt-2 font-semibold text-white bg-black rounded text-xs hover:bg-gray-800"
    >
      Clear Room
    </button>

    <!-- src/components/GameRoom.vue -->
  </div>
</template>

<script>
import Game from "@/game";
import { FloorFurniture } from "@tetreum/shroom";
import { EventBus } from "@/eventBus"; // Import the EventBus
import RoomItemsList from "@/components/RoomItemList.vue"; // Import RoomItemsList
import GameController from "@/components/GameController.vue";

export default {
  name: "GameRoom",
  components: {
    RoomItemsList,
    GameController,
  },
  props: ["roomId"],
  data() {
    return {
      game: null,
      selectedItemType: "",
      selectedItem: null,
      form: {
        type: "",
        roomX: 4,
        roomY: 4,
        roomZ: 0,
        direction: 2,
        animation: 1,
      },
    };
  },
  async mounted() {
    const canvas = this.$refs.canvas;
    const roomId = this.$route.params.id || this.roomId || "home";
    await this.$store.dispatch("selectRoomById", roomId);
    const currentRoom = this.$store.state.currentRoom;
    this.game = new Game(canvas, currentRoom);
    this.game.application.stage.addChild(this.game.room);
  },
  methods: {
    clearRoomItems() {
      this.game.room.roomObjects.forEach((object) => {
        if (object instanceof FloorFurniture) {
          this.game.room.removeRoomObject(object);
        }
      });
      this.saveRoomToLocalStorage();
      //reload page
      location.reload();
    },
    saveRoomToLocalStorage() {
      const roomData = this.game.getSerializedRoom();
      localStorage.setItem("savedRoom", JSON.stringify(roomData));
    },
    addItemByClassName(classname) {
      const newItem = new FloorFurniture({
        type: classname,
        roomX: 1,
        roomY: 1,
        roomZ: 0,
        direction: 2,
        animation: 1,
      });
      this.game.addItem(newItem);
    },
    addItem() {
      const newItem = new FloorFurniture({ ...this.form });
      this.game.addItem(newItem);
      this.saveRoomToLocalStorage();

      // unselectFurniture
      // this.game.unselectFurniture();
    },

    handleKeydown(event) {
      if (!this.selectedItem) return;

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          this.selectedItem.roomX -= 1;
          break;
        case "ArrowRight":
          event.preventDefault();
          this.selectedItem.roomX += 1;
          break;
        case "ArrowUp":
          event.preventDefault();
          this.selectedItem.roomY -= 1;
          break;
        case "ArrowDown":
          event.preventDefault();
          this.selectedItem.roomY += 1;
          break;
        case ",":
          this.selectedItem.direction = (this.selectedItem.direction + 1) % 8;
          break;
      }
      this.saveRoomToLocalStorage();
    },
  },
  created() {
    // Listen for the 'item-selected' event and update selectedItemType
    EventBus.$on("item-selected", (item) => {
      this.selectedItem = item;
      this.selectedItemType = item.type;
    });

    // Listen for the 'item-unselected' event and clear selectedItemType
    EventBus.$on("item-unselected", (item) => {
      console.log("item-unselected", item);
      this.selectedItem = null;
      this.selectedItemType = "";
    });

    this.$root.$on("add-to-room", (classname) => {
      console.log("add-to-room", classname);
      this.addItemByClassName(classname);
      this.saveRoomToLocalStorage();
    });

    EventBus.$on("select-item", (item) => {
      this.game.onFurnitureItemClick(item);
    });

    EventBus.$on("furni-added", (item) => {
      console.log("👋Added", item);
      //   this.selectedItem = item;
      //   this.game.onFurnitureItemClick(item);
      //   this.saveRoomToLocalStorage();
    });

    EventBus.$on("update-item", () => {
      this.game.updateItem(this.selectedItem);
      this.saveRoomToLocalStorage();
    });
  },
};
</script>
