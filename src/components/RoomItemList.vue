<template>
  <div
    class="relative -mt-[64px] h-[64px] grid auto-cols-max grid-flow-col bg-opacity-25 p-2 gap-1 overflow-hidden overflow-x-scroll no-scrollbar"
  >
    <special-button
      @button-click="emitSettings"
      :icon="['fas', 'gear']"
    ></special-button>
    <div
      v-for="item in localRoomItems"
      :key="item.id"
      class="rounded-lg w-[44px] h-auto furni-box border border-black bottom-1 bg-gray-200 flex-shrink-0 flex items-center justify-center"
      :class="{
        'bg-blue-300 shadow-inner border-3 border-blue-500':
          selectedItem === item,
      }"
      @click="selectItem(item)"
    >
      <img :src="getIconUrl(item.type)" class="object-contain" />
    </div>
  </div>
</template>

<script>
import { EventBus } from '@/eventBus';
import SpecialButton from '@/components/SpecialButton.vue';

export default {
  name: 'RoomItemsList',
  components: {
    SpecialButton,
  },
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
      EventBus.emit('item-settings');
    },
    selectItem(item) {
      EventBus.emit('select-item', item);
    },
    getIconUrl(type) {
      //Remove from here
      return `https://api.ducket.net/assets/furni/${type.replace(
        '*',
        '_'
      )}_icon.png`;
    },
  },
  mounted() {
    this.localRoomItems = [...this.roomItems].reverse();
  },
  created() {
    EventBus.on('furni-added', (item) => {
      // Add the item to the start of the array
      this.localRoomItems.unshift(item);
    });

    EventBus.on('furni-removed', (item) => {
      // Remove the item from the array
      this.localRoomItems.splice(
        this.localRoomItems.findIndex((i) => i === item),
        1
      );
    });

    EventBus.on('select-item', (item) => {
      // Find the index of the selected item

      console.log(this.localRoomItems);

      const itemIndex = this.localRoomItems.findIndex((i) => i === item);

      if (itemIndex !== -1) {
        this.localRoomItems.splice(itemIndex, 1);

        // Add the item to the start of the array
        this.localRoomItems.unshift(item);
      }

      this.selectedItem = item;

      // If the item is found, remove it from its current position
    });

    EventBus.on('item-unselected', () => {
      this.selectedItem = null;
    });
  },
};
</script>
