<!-- src/components/RoomItemsList.vue -->

<template>
  <div
    class="relative -mt-[64px] h-[64px] grid auto-cols-max grid-flow-col bg-black bg-opacity-25 p-2 gap-2 overflow-hidden overflow-x-scroll no-scrollbar"
    v-if="localRoomItems.length > 0"
  >
    <button
      @click="emitCatalog()"
      class="rounded-lg w-[50px] h-[50px] bg-gray-200 border border-black bottom-1 flex-shrink-0 flex items-center justify-center p-1"
    >
      <font-awesome-icon :icon="['fas', 'plus']" />
    </button>
    <div
      v-for="item in localRoomItems"
      :key="item.id"
      class="rounded-lg w-[50px] h-[50px] border border-black bottom-1 bg-gray-200 flex-shrink-0 flex items-center justify-center"
      :class="{
        'bg-blue-100 shadow-inner border-2 border-blue-500':
          selectedItem === item,
      }"
      @click="selectItem(item)"
    >
      <img
        class="max-w-full max-h-full object-contain"
        :src="getIconUrl(item.type)"
      />
    </div>

    <button
      @click="emitSettings()"
      class="rounded-lg w-[50px] h-[50px] border border-black bottom-1 bg-gray-200 flex-shrink-0 flex items-center justify-center p-1"
    >
      <font-awesome-icon :icon="['fas', 'gear']" />
    </button>
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
    emitSettings() {
      EventBus.$emit("item-settings");
    },
    emitCatalog() {
      EventBus.$emit("item-catalog");
    },
    selectItem(item) {
      EventBus.$emit("select-item", item);
    },
    getIconUrl(type) {
      //Remove from here
      return `https://ducket.net/assets/furni/${type.replace(
        "*",
        "_"
      )}_icon.png`;
    },
  },
  mounted() {
    this.localRoomItems = [...this.roomItems];
  },
  created() {
    EventBus.$on("item-selected", (item) => {
      this.selectedItem = item;
      console.log(item);
    });

    EventBus.$on("furni-added", (item) => {
      this.localRoomItems.push(item);
    });

    EventBus.$on("furni-removed", (item) => {
      this.localRoomItems.splice(
        this.localRoomItems.findIndex((i) => i === item),
        1
      );
    });

    EventBus.$on("item-unselected", () => {
      this.selectedItem = null;
    });
  },
};
</script>
