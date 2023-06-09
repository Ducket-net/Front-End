<!-- src/components/RoomItemsList.vue -->

<template>
  <div
    class="absolute top-2 bg-white rounded shadow-md p-1 overflow-y-auto"
    v-if="localRoomItems.length > 0"
  >
    <div
      v-for="item in localRoomItems"
      :key="item.id"
      class="rounded-md w-[40px] h-[40px] bg-gray-200 flex-shrink-0 flex items-center justify-center p-1 mb-1"
      :class="{ 'bg-blue-200': selectedItem === item }"
      @click="selectItem(item)"
    >
      <img
        class="max-w-full max-h-full object-contain"
        :src="'https://ducket.net/assets/furni/' + item.type + '_icon.png'"
      />
    </div>
  </div>
</template>

<script>
import { EventBus } from "@/eventBus";

export default {
  name: "RoomItemsList",
  props: {
    roomItems: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectedItem: null,
      localRoomItems: [],
    };
  },
  methods: {
    selectItem(item) {
      EventBus.$emit("select-item", item);
    },
  },
  mounted() {
    this.localRoomItems = [...this.roomItems];
  },
  created() {
    EventBus.$on("item-selected", (item) => {
      this.selectedItem = item;
    });

    EventBus.$on("furni-added", (item) => {
      this.localRoomItems.push(item);
    });

    EventBus.$on("item-unselected", () => {
      this.selectedItem = null;
    });
  },
};
</script>
