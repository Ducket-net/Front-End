<template>
  <div
    v-if="selectedItem"
    class="max-w-sm mx-auto rounded-md shadow-md p-1 text-white"
  >
    <div class="grid grid-cols-4 gap-1 mb-2">
      <button
        @click="moveFurnitureItem(-1, 0)"
        class="w-full py-2 mt-2 font-semibold text-white bg-black rounded text-xs"
      >
        <!-- <i class="fa fa-angle-double-down"></i> -->
        <font-awesome-icon
          :icon="['fas', 'arrow-right']"
          :style="{ transform: 'rotate(225deg)' }"
        />
      </button>
      <button
        @click="moveFurnitureItem(0, -1)"
        class="w-full py-2 mt-2 font-semibold text-white bg-black rounded text-xs"
      >
        <font-awesome-icon
          :icon="['fas', 'arrow-right']"
          :style="{ transform: 'rotate(315deg)' }"
        />
      </button>
      <button
        @click="game.unselectFurniture(selectedItem)"
        class="w-full py-2 mt-2 font-semibold text-white bg-black rounded text-xs"
      >
        <font-awesome-icon :icon="['fas', 'star']" /> De-Select
      </button>
      <button
        @click="selectedItem.roomZ += 0.5"
        class="w-full py-2 mt-2 font-semibold text-white bg-black rounded text-xs"
      >
        <font-awesome-icon :icon="['fas', 'arrow-up']" />
        Up
      </button>
      <button
        @click="moveFurnitureItem(0, 1)"
        class="w-full py-2 mt-2 font-semibold text-white bg-black rounded text-xs"
      >
        <font-awesome-icon
          :icon="['fas', 'arrow-right']"
          :style="{ transform: 'rotate(135deg)' }"
        />
      </button>
      <button
        @click="moveFurnitureItem(1, 0)"
        class="w-full py-2 mt-2 font-semibold text-white bg-black rounded text-xs"
      >
        <font-awesome-icon
          :icon="['fas', 'arrow-right']"
          :style="{ transform: 'rotate(45deg)' }"
        />
      </button>

      <button
        @click="selectedItem.direction = (selectedItem.direction + 2) % 8"
        class="w-full py-2 mt-2 font-semibold text-white bg-black rounded text-xs"
      >
        <font-awesome-icon :icon="['fas', 'arrow-rotate-left']" /> Rotate
      </button>

      <button
        @click="selectedItem.roomZ -= 0.5"
        class="w-full py-2 mt-2 font-semibold text-white bg-black rounded text-xs"
      >
        <font-awesome-icon :icon="['fas', 'arrow-down']" />
        Down
      </button>
    </div>

    <button
      @click="game.unselectFurniture(selectedItem)"
      class="w-full py-3 mb-2 font-semibold bg-green-700 text-white rounded text-xs"
    >
      <font-awesome-icon :icon="['fas', 'star']" /> Save (Unselect)
    </button>

    <div class="text-xs mb-4">
      <div class="grid grid-cols-[auto,1fr] gap-3">
        <div class="grid grid-cols-[50px,auto]">
          <img
            :src="getIconUrl(selectedItem.type)"
            class="max-w-full max-h-full object-contain"
          />
          <div>
            <p>{{ selectedItem.type }}</p>
            <p>
              {{ selectedItem.roomX.toFixed(2) }} |
              {{ selectedItem.roomY.toFixed(2) }} | Z:
              {{ selectedItem.roomZ.toFixed(2) }} | {{ selectedItem.direction }}
            </p>
          </div>
        </div>
        <!-- <p>Animation: {{ selectedItem.animation }}</p> -->
        <div>
          <button
            @click="removeRoomItem"
            class="p-2 mt-2 mr-2 font-semibold text-white bg-black rounded text-xs hover:bg-gray-800"
          >
            <font-awesome-icon :icon="['fas', 'trash']" /> Furni
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { EventBus } from "@/eventBus";
import { FloorFurniture } from "@tetreum/shroom";

export default {
  name: "GameController",
  props: ["game"],
  data() {
    return {
      selectedItem: null,
    };
  },
  created() {
    EventBus.$on("item-selected", (item) => {
      this.selectedItem = item;
    });

    EventBus.$on("item-unselected", (item) => {
      console.log("item unselected", item);
      this.selectedItem = null;
      this.saveRoomToLocalStorage();
    });
  },
  methods: {
    saveRoomToLocalStorage() {
      const roomData = this.game.getSerializedRoom();
      localStorage.setItem("savedRoom", JSON.stringify(roomData));
    },
    getIconUrl(type) {
      //Remove from here
      return `https://ducket.net/assets/furni/${type.replace(
        "*",
        "_"
      )}_icon.png`;
    },
    updateItem() {
      EventBus.$emit("update-item", this.selectedItem);
      this.saveRoomToLocalStorage();
    },
    removeRoomItem() {
      this.game.room.removeRoomObject(this.selectedItem);
      this.saveRoomToLocalStorage();
      this.selectedItem = null;

      //Emit
      EventBus.$emit("furni-removed", this.selectedItem);
    },
    moveFurnitureItem(moveX, moveY) {
      // Make sure there is a selected furniture item
      if (this.selectedItem) {
        // Access the moveFurnitureItem method from the game object using $refs
        this.game.moveFurnitureItem(this.selectedItem, moveX, moveY);
      }
    },
    clearRoomItems() {
      //Confirm
      if (!confirm("Are you sure you want to clear the room?")) return;
      //Remove all floor furniture
      this.game.room.roomObjects.forEach((object) => {
        if (object instanceof FloorFurniture) {
          this.game.room.removeRoomObject(object);
        }
      });
      this.saveRoomToLocalStorage();
      //reload page
      location.reload();
    },
  },
};
</script>
