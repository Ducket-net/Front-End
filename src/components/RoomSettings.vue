<!-- Login.vue -->
<template>
  <transition name="fade">
    <div
      v-if="roomSettingsOpen"
      class="max-w-md mx-auto pt-[42px] absolute top-0 left-0 right-0"
    >
      <!-- BG Color -->

      <div
        class="absolute top-80 right-4 left-4 bg-white overflow-auto rounded-lg z-10"
        v-if="showBgColorPicker"
      >
        <Swatches v-model="bgColor" />
        <button
          @click="showBgColorPicker = false"
          class="w-full py-2 h-[42px] mt-2 font-semibold text-white bg-black rounded text-xs rounded-t-none"
        >
          <font-awesome-icon :icon="['fas', 'close']" />
          Close Background Picker
        </button>
      </div>
      <!-- BG Color -->

      <!-- Wall Color -->
      <div
        @click="showWallColorPicker = !showWallColorPicker"
        class="rounded-full absolute top-48 transform left-1/2 translate-x-24 -translate-y-0 bg-black text-white overflow-auto bg-opacity-70 text-xs px-5 py-3 hover:bg-gray-900 cursor-pointer"
      >
        <font-awesome-icon
          class="text-white overflow-auto rounded-lg"
          icon="cube"
        />
        Wall
      </div>
      <div
        class="absolute top-80 right-4 left-4 bg-white overflow-auto rounded-lg z-10"
        v-if="showWallColorPicker"
      >
        <Swatches v-model="wallColor" />
        <button
          @click="showWallColorPicker = false"
          class="w-full py-2 h-[42px] mt-2 font-semibold text-white bg-black rounded text-xs rounded-t-none"
        >
          <font-awesome-icon :icon="['fas', 'close']" />
          Close Wall Picker
        </button>
      </div>
      <!-- Wall Color -->

      <!-- Floor Color -->
      <div
        @click="showFloorColorPicker = !showFloorColorPicker"
        class="absolute top-64 transform left-1/2 -translate-x-1/2 translate-y-16 bg-black text-white overflow-auto rounded-full bg-opacity-70 text-xs px-5 py-3 hover:bg-gray-900 cursor-pointer"
      >
        <font-awesome-icon
          class="text-white overflow-auto rounded-lg"
          icon="cube"
        />
        Floor
      </div>
      <div
        class="absolute top-80 right-4 left-4 bg-white overflow-auto rounded-lg z-10"
        v-if="showFloorColorPicker"
      >
        <Swatches v-model="floorColor" />
        <button
          @click="showFloorColorPicker = false"
          class="w-full h-[42px] py-2 mt-2 font-semibold text-white bg-black rounded text-xs rounded-t-none"
        >
          <font-awesome-icon :icon="['fas', 'close']" />
          Close Floor Picker
        </button>
      </div>
      <!-- Floor Color -->

      <div class="grid grid-cols-3 grid-rows-2 text-left">
        <button
          @click="roomSettingsOpen = false"
          class="text-white overflow-auto bg-opacity-70 text-xs px-5 py-3 hover:bg-gray-900 cursor-pointer"
        >
          <font-awesome-icon :icon="['fas', 'close']" /> Close Settings
        </button>

        <button
          @click="showBgColorPicker = !showBgColorPicker"
          class="text-white overflow-auto bg-opacity-70 text-xs px-5 py-3 hover:bg-gray-900 cursor-pointer"
        >
          <!-- <font-awesome-icon
              class="text-white overflow-auto rounded-lg"
              icon="cube"
            /> -->
          <!-- Background -->
        </button>
        <button
          @click="clearLocalStorage"
          class="top-80 text-red-500 overflow-auto bg-opacity-70 text-xs px-5 py-3 hover:bg-gray-900 cursor-pointer"
        >
          <font-awesome-icon :icon="['fas', 'trash']" /> Debug Reset
        </button>

        <button
          @click="removeAllItems"
          class="top-80 text-red-500 overflow-auto bg-opacity-70 text-xs px-5 py-3 hover:bg-gray-900 cursor-pointer"
        >
          <font-awesome-icon :icon="['fas', 'trash']" /> Remove All Items
        </button>

        <button
          @click="toggleWall"
          class="top-32 text-white overflow-auto l bg-opacity-70 text-xs px-5 py-3 hover:bg-gray-900 cursor-pointer"
        >
          Toggle Wall
        </button>

        <button
          @click="toggleFloor"
          class="left-0 top-[55px] text-white overflow-auto bg-opacity-70 text-xs px-5 py-3 hover:bg-gray-900 cursor-pointer"
        >
          Toggle Floor & Wall
        </button>

        <button
          @click="showBgColorPicker = !showBgColorPicker"
          class="text-white overflow-auto bg-opacity-70 text-xs px-5 py-3 hover:bg-gray-900 cursor-pointer"
        >
          <font-awesome-icon
            class="text-white overflow-auto rounded-lg"
            icon="cube"
          />
          Background
        </button>

        <div class="grid col-span-3 grid-cols-4 mt-64">
          <button
            @click="moveRoom('up')"
            class="text-white overflow-auto l bg-opacity-70 text-xs px-5 py-3 hover:bg-gray-900 cursor-pointer"
          >
            RoomUp
          </button>
          <button
            @click="moveRoom('down')"
            class="text-white overflow-auto l bg-opacity-70 text-xs px-5 py-3 hover:bg-gray-900 cursor-pointer"
          >
            RoomDown
          </button>
          <button
            @click="moveRoom('left')"
            class="text-white overflow-auto l bg-opacity-70 text-xs px-5 py-3 hover:bg-gray-900 cursor-pointer"
          >
            RoomLeft
          </button>
          <button
            @click="moveRoom('right')"
            class="text-white overflow-auto l bg-opacity-70 text-xs px-5 py-3 hover:bg-gray-900 cursor-pointer"
          >
            RoomRight
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Swatches from 'vue-color/src/components/Swatches';
import authService from '@/services/authService';
import EventBus from '@/eventBus.js';

export default {
  components: {
    Swatches,
  },
  props: ['gameRoom'],
  data() {
    return {
      room: this.gameRoom,
      showBgColorPicker: false,
      showWallColorPicker: false,
      showFloorColorPicker: false,
      roomSettingsOpen: false,
      bgColor: this.$store.state.room.settings.bgColor,
      wallColor: this.$store.state.room.settings.wallColor,
      floorColor: this.$store.state.room.settings.floorColor,
    };
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    handleWallColorChange(hexColor) {
      // Call the fromHex function or handle the color change here
      this.room.wallColor = hexColor;
      this.$store.commit('setRoomWallColor', hexColor);
    },
    // eslint-disable-next-line no-unused-vars
    handleFloorColorChange(hexColor) {
      // Call the fromHex function or handle the color change here
      this.room.floorColor = hexColor;
      //Commit to store.js
      this.$store.commit('setRoomFloorColor', hexColor);
    },
    handleBgColorChange(hexColor) {
      // Call the fromHex function or handle the color change here
      this.$store.commit('setRoomBgColor', hexColor);
    },
    authorize() {
      authService.getAuthorizationCode();
    },
    clearLocalStorage() {
      // Confirm
      if (!confirm('Are you sure you want to reset all?')) return;
      localStorage.clear();
      // Clear IndexedDB
      indexedDB.deleteDatabase('furnidataDB');
      location.reload();
    },
    toggleWall() {
      this.room.hideWalls = !this.room.hideWalls;

      if (this.room.hideWalls) {
        this.room.y = 224;
        this.room.x = this.room.x + 8;
      } else {
        this.room.y = 100;
        this.room.x = this.room.x - 8;
      }

      localStorage.setItem('hideWalls', this.room.hideWalls);
    },
    toggleFloor() {
      this.room.hideFloor = !this.room.hideFloor;
      this.toggleWall();
      localStorage.setItem('hideFloor', this.room.hideFloor);
    },
    removeAllItems() {
      if (!confirm('Are you sure you want to reset all?')) return;
      this.room.roomObjects.forEach((item) => {
        this.room.removeRoomObject(item);
      });
      this.$store.commit('saveRoomToLocalStorage');
    },
  },
  created() {
    EventBus.$on('item-settings', () => {
      this.roomSettingsOpen = !this.roomSettingsOpen;
    });
  },
  mounted() {},
  watch: {
    wallColor: {
      handler(newColor) {
        this.handleWallColorChange(newColor.hex);
      },
      deep: true,
    },
    floorColor: {
      handler(newColor) {
        this.handleFloorColorChange(newColor.hex);
      },
      deep: true,
    },
    bgColor: {
      handler(newColor) {
        this.handleBgColorChange(newColor.hex);
        EventBus.$emit('bg-color-change', newColor.hex);
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.vc-swatches {
  box-shadow: none !important;
  width: 100%;
  background-color: transparent;
  padding: 0 !important;
  height: 300px;
}
.vc-swatches-box {
  padding: 0px !important;
  margin: 0px !important;
}
</style>
