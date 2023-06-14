<template>
  <div v-if="selectedItem" class="mx-auto rounded-md text-white">
    <div class="grid grid-cols-4 grid-rows-[50px,50px] gap-1">
      <button
        @click="moveFurnitureItem(-increment, 0)"
        class="w-full font-semibold text-white bg-black rounded active:bg-gray-800 controller-button text-xs"
      >
        <!-- <i class="fa fa-angle-double-down"></i> -->
        <font-awesome-icon
          :icon="['fas', 'arrow-right']"
          :style="{ transform: 'rotate(225deg)' }"
        />
      </button>

      <button
        @click="moveFurnitureItem(0, -increment)"
        class="w-full font-semibold text-white bg-black rounded active:bg-gray-800 controller-button text-xs"
      >
        <font-awesome-icon
          :icon="['fas', 'arrow-right']"
          :style="{ transform: 'rotate(315deg)' }"
        />
      </button>

      <button
        @click="selectedItem.roomZ += increment"
        class="w-full font-semibold text-white bg-black rounded active:bg-gray-800 controller-button text-xs"
      >
        <font-awesome-icon :icon="['fas', 'arrow-up']" />
        Up
      </button>
      <button
        @click="selectedItem.direction = (selectedItem.direction + 2) % 8"
        class="w-full font-semibold text-white bg-black rounded active:bg-gray-800 controller-button text-xs row-span-2 active:bg-gray-800 controller-button"
      >
        <font-awesome-icon :icon="['fas', 'arrow-rotate-left']" /> Rotate
      </button>
      <button
        @click="moveFurnitureItem(0, increment)"
        class="w-full font-semibold text-white bg-black rounded active:bg-gray-800 controller-button text-xs"
      >
        <font-awesome-icon
          :icon="['fas', 'arrow-right']"
          :style="{ transform: 'rotate(135deg)' }"
        />
      </button>
      <button
        @click="moveFurnitureItem(increment, 0)"
        class="w-full font-semibold text-white bg-black rounded active:bg-gray-800 controller-button text-xs"
      >
        <font-awesome-icon
          :icon="['fas', 'arrow-right']"
          :style="{ transform: 'rotate(45deg)' }"
        />
      </button>

      <button
        @click="selectedItem.roomZ -= increment"
        class="w-full py-2 font-semibold text-white bg-black rounded active:bg-gray-800 controller-button text-xs"
      >
        <font-awesome-icon :icon="['fas', 'arrow-down']" />
        Down
      </button>
    </div>

    <!-- Advanced Settings -->

    <button
      @click="isContentVisible = !isContentVisible || false"
      class="text-xs text-white p-2 w-full h-12"
    >
      Advanced Settings
    </button>
    <div
      :class="{ hidden: !isContentVisible }"
      class="rounded text-xs text-white w-full mb-2"
    >
      <label
        class="flex-grow font-semibold text-white rounded text-xs mb-1 mt-0 block"
      >
        <font-awesome-icon :icon="['fas', 'arrows-alt-h']" /> Increment
      </label>
      <div class="w-full flex space-x-1">
        <button
          @click="increment = 0.1"
          class="h-[42px] rounded-md bg-black p-3 w-full font-semibold text-white text-xs active:bg-gray-800 controller-button"
        >
          .1
        </button>
        <button
          @click="increment = 0.5"
          class="h-[42px] rounded-md bg-black p-3 w-full font-semibold text-white text-xs active:bg-gray-800 controller-button"
        >
          .5
        </button>
        <button
          @click="increment = 1.0"
          class="h-[42px] rounded-md bg-black p-3 w-full font-semibold text-white text-xs active:bg-gray-800 controller-button"
        >
          1
        </button>
        <button
          @click="increment = 2.0"
          class="h-[42px] rounded-md bg-black p-3 w-full font-semibold text-white text-xs active:bg-gray-800 controller-button"
        >
          2
        </button>

        <!-- Move Room -->
      </div>
    </div>

    <button
      @click="game.unselectFurniture(selectedItem)"
      class="w-full py-3 mb-2 font-semibold bg-green-700 text-white rounded text-xs h-12"
    >
      <font-awesome-icon :icon="['fas', 'star']" /> Save (Unselect)
    </button>

    <div class="text-xs mb-4">
      <div class="grid grid-cols-[auto,1fr] gap-3">
        <div class="grid grid-cols-[auto,auto]">
          <img
            :src="getIconUrl(selectedItem.type)"
            class="max-w-full max-h-full object-contain w-[20px] h-[40px] mr-1"
          />
          <div>
            <p>{{ selectedItem.type }}</p>
            <p>
              X{{ selectedItem.roomX.toFixed(2) }} | Y{{
                selectedItem.roomY.toFixed(2)
              }}
              | Z:{{ selectedItem.roomZ.toFixed(2) }} | R{{
                selectedItem.direction
              }}
              | I{{ increment }} | A{{ selectedItem.animation }}
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
      increment: 1,
      selectedItem: null,
      isContentVisible: false,
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

    EventBus.$on("furni-added", () => {
      setTimeout(() => {
        this.saveRoomToLocalStorage();
      }, 1500);
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
      EventBus.$emit("furni-removed", this.selectedItem);
      this.game.room.removeRoomObject(this.selectedItem);
      this.saveRoomToLocalStorage();
      this.selectedItem = null;

      //Emit
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
