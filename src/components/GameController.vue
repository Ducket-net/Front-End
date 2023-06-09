<template>
  <div
    v-if="selectedItem"
    class="max-w-sm mx-auto bg-white bg-opacity-50 rounded-md shadow-md p-2 text-white"
  >
    <div class="grid grid-cols-4 gap-1 mb-3">
      <button
        @click="selectedItem.roomX -= 0.5"
        class="w-full py-2 mt-2 font-semibold text-white bg-black rounded text-xs"
      >
        <!-- <i class="fa fa-angle-double-down"></i> -->
        <font-awesome-icon
          :icon="['fas', 'arrow-right']"
          :style="{ transform: 'rotate(225deg)' }"
        />
      </button>
      <button
        @click="selectedItem.roomY -= 0.5"
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
        Unselect
      </button>
      <button
        @click="selectedItem.roomZ += 0.5"
        class="w-full py-2 mt-2 font-semibold text-white bg-black rounded text-xs"
      >
        Up
      </button>
      <button
        @click="selectedItem.roomY += 0.5"
        class="w-full py-2 mt-2 font-semibold text-white bg-black rounded text-xs"
      >
        <font-awesome-icon
          :icon="['fas', 'arrow-right']"
          :style="{ transform: 'rotate(135deg)' }"
        />
      </button>
      <button
        @click="selectedItem.roomX += 0.5"
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
        Down
      </button>
    </div>

    <div class="text-xs mb-4">
      <p>Type: {{ selectedItem.type }}</p>
      <p>
        {{ selectedItem.roomX.toFixed(2) }} |
        {{ selectedItem.roomY.toFixed(2) }} | Z:
        {{ selectedItem.roomZ.toFixed(2) }} | {{ selectedItem.direction }}
      </p>
      <!-- <p>Animation: {{ selectedItem.animation }}</p> -->
    </div>
  </div>
</template>

<script>
import { EventBus } from "@/eventBus";

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
    });
  },
  methods: {
    updateItem() {
      EventBus.$emit("update-item", this.selectedItem);
    },
  },
};
</script>
