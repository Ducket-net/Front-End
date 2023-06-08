<!-- src/components/GameRoom.vue -->
<template>
  <div ref="container">
    <!-- <h2>Room {{ roomId }}</h2> -->
    <div
      ref="canvasContainer"
      id="canvasContainer"
      @keydown="handleKeydown"
      tabindex="0"
    >
      <canvas ref="canvas" class="mx-auto outline-0"></canvas>
      <div>
        <p v-if="selectedItemType">
          hi Selected Item Type: {{ selectedItemType }}
        </p>
        <div
          v-if="selectedItem"
          class="add-item-form space-y-4"
          ref="selectedItemForm"
        >
          <button
            @click="game.unselectFurniture(selectedItem)"
            class="px-2 py-1 bg-blue-500 text-white rounded"
          >
            Unselect
          </button>
          <div>
            <label>Type</label>
            <input
              v-model="selectedItem.type"
              placeholder="Type"
              class="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label>Position Z</label>
            <button
              @click="selectedItem.roomZ -= 0.2"
              class="px-2 py-1 mr-2 bg-blue-500 text-white rounded"
            >
              Down
            </button>
            <button
              @click="selectedItem.roomZ += 0.2"
              class="px-2 py-1 ml-2 bg-blue-500 text-white rounded"
            >
              Up
            </button>
          </div>
          <div>
            <label>Position X</label>
            <button
              @click="selectedItem.roomX -= 1"
              class="px-2 py-1 mr-2 bg-blue-500 text-white rounded"
            >
              -
            </button>
            {{ selectedItem.roomX }}
            <button
              @click="selectedItem.roomX += 1"
              class="px-2 py-1 ml-2 bg-blue-500 text-white rounded"
            >
              +
            </button>
          </div>
          <div>
            <label>Position Y</label>
            <button
              @click="selectedItem.roomY -= 1"
              class="px-2 py-1 mr-2 bg-blue-500 text-white rounded"
            >
              -
            </button>
            {{ selectedItem.roomY }}
            <button
              @click="selectedItem.roomY += 1"
              class="px-2 py-1 ml-2 bg-blue-500 text-white rounded"
            >
              +
            </button>
          </div>
          <div>
            <label>Direction</label>
            <button
              @click="selectedItem.direction = (selectedItem.direction + 2) % 8"
              class="px-2 py-1 bg-blue-500 text-white rounded"
            >
              Change
            </button>
            {{ selectedItem.direction }}
          </div>
          <label>Animation</label>
          <input
            v-model="selectedItem.animation"
            placeholder="Animation"
            class="w-full p-2 border border-gray-300 rounded"
          />
          <button
            @click="updateItem(selectedItem)"
            type="button"
            class="w-full py-2 mt-2 font-bold text-white bg-blue-500 rounded"
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

      // unselectFurniture
      // this.game.unselectFurniture();
    },
    updateItem() {
      // Call the game updateItem method
      this.game.updateItem(this.selectedItem);
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
    });
  },
};
</script>
