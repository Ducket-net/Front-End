<!-- src/components/GameRoom.vue -->
<template>
  <div ref="container" class="max-w-lg mx-auto">
    <!-- <h2>Room {{ roomId }}</h2> -->
    <div
      ref="canvasContainer"
      id="canvasContainer"
      @keydown="handleKeydown"
      tabindex="0"
    >
      <canvas ref="canvas" class="mx-auto outline-0"></canvas>
      <div
        v-if="selectedItem"
        class="max-w-sm mx-auto bg-white bg-opacity-50 rounded-md shadow-md p-4 text-white mt-4"
      >
        <h3 class="text-xs uppercase font-mono mb-3">Selected Item</h3>

        <div class="text-xs mb-4">
          <p>Type: {{ selectedItem.type }}</p>
          <p>
            Position: ({{ selectedItem.roomX.toFixed(2) }},
            {{ selectedItem.roomY.toFixed(2) }})
          </p>
          <p>Position Z: {{ selectedItem.roomZ.toFixed(2) }}</p>
          <p>Direction: {{ selectedItem.direction }}</p>
          <!-- <p>Animation: {{ selectedItem.animation }}</p> -->
        </div>

        <div class="space-y-4">
          <button
            @click="game.unselectFurniture(selectedItem)"
            class="w-full py-2 bg-black text-white rounded text-xs"
          >
            Unselect
          </button>

          <div class="flex items-center">
            <label class="w-1/3">Position Z</label>
            <button
              @click="selectedItem.roomZ -= 0.2"
              class="bg-black text-white rounded p-4 text-xs"
            >
              Down
            </button>
            <button
              @click="selectedItem.roomZ += 0.2"
              class="bg-black text-white rounded p-4 ml-2 text-xs"
            >
              Up
            </button>
          </div>

          <div class="flex items-center">
            <label class="w-1/3">Position X</label>
            <button
              @click="selectedItem.roomX -= 0.2"
              class="bg-black text-white rounded p-4 text-xs"
            >
              -
            </button>
            <button
              @click="selectedItem.roomX += 0.2"
              class="bg-black text-white rounded p-4 ml-2 text-xs"
            >
              +
            </button>
          </div>

          <div class="flex items-center">
            <label class="w-1/3">Position Y</label>
            <button
              @click="selectedItem.roomY -= 0.2"
              class="bg-black text-white rounded p-4 text-xs"
            >
              -
            </button>
            <button
              @click="selectedItem.roomY += 0.2"
              class="bg-black text-white rounded p-4 ml-2 text-xs"
            >
              +
            </button>
          </div>

          <div class="flex items-center">
            <label class="w-1/3">Direction</label>
            <button
              @click="selectedItem.direction = (selectedItem.direction + 2) % 8"
              class="w-full py-2 bg-black text-white rounded text-xs"
            >
              Change Direction
            </button>
          </div>

          <!-- <div>
            <label for="animation">Animation</label>
            <input
              id="animation"
              v-model="selectedItem.animation"
              placeholder="Animation"
              class="w-full p-2 border border-gray-300 rounded text-xs"
            />
          </div> -->

          <button
            @click="updateItem(selectedItem)"
            type="button"
            class="w-full py-2 mt-2 font-semibold text-white bg-black rounded text-xs"
          >
            Update Item
          </button>
        </div>
      </div>
    </div>

    <!-- src/components/GameRoom.vue -->
  </div>
</template>

<script>
import Game from "@/game";
import { FloorFurniture } from "@tetreum/shroom";
import { EventBus } from "@/eventBus"; // Import the EventBus

export default {
  name: "GameRoom",
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
    saveRoomToLocalStorage() {
      const roomData = this.game.getSerializedRoom();
      localStorage.setItem("savedRoom", JSON.stringify(roomData));
    },
    addItemByClassName(classname) {
      const newItem = new FloorFurniture({
        type: classname,
        roomX: 4,
        roomY: 4,
        roomZ: 0,
        direction: 2,
        animation: 1,
      });
      this.game.addItem(newItem);
      //Emits the item-selected event
      EventBus.$emit("item-selected", newItem);
    },
    addItem() {
      const newItem = new FloorFurniture({ ...this.form });
      this.game.addItem(newItem);
      this.saveRoomToLocalStorage();

      // unselectFurniture
      // this.game.unselectFurniture();
    },
    updateItem() {
      // Call the game updateItem method
      this.game.updateItem(this.selectedItem);
      this.saveRoomToLocalStorage();
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
  },
};
</script>
