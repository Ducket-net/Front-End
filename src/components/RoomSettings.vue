<!-- Login.vue -->
<template>
  <div class="relative p-2">
    <transition name="fade">
      <div
        v-if="roomSettingsOpen"
        class="max-w-md mx-auto p-1 grid grid-flow-row gap-1 grid-cols-2"
        :style="{ backgroundColor: $store.state.room.settings.bgColor }"
      >
        <SpecialButton
          @button-click="toggleColorPicker('roomSettingsOpen')"
          class="w-full text-sm"
          >Close Settings</SpecialButton
        >
        <SpecialButton
          @button-click="toggleColorPicker('showWallColorPicker')"
          class="w-full text-sm"
          >Edit Wall Color</SpecialButton
        >
        <SpecialButton
          @button-click="toggleColorPicker('showFloorColorPicker')"
          class="w-full text-sm"
          >Edit Floor Color</SpecialButton
        >
        <SpecialButton
          @button-click="toggleColorPicker('showBgColorPicker')"
          class="w-full text-sm"
          >Edit Background Color</SpecialButton
        >
        <SpecialButton @button-click="toggleWall()" class="w-full text-sm"
          >Toggle Wall</SpecialButton
        >
        <SpecialButton @button-click="toggleFloor()" class="w-full text-sm"
          >Toggle Floor</SpecialButton
        >
        <SpecialButton @button-click="removeAllItems()" class="w-full text-sm"
          >Remove All Items</SpecialButton
        >
        <SpecialButton
          @button-click="clearLocalStorage()"
          class="w-full text-sm"
          >Debug Reset</SpecialButton
        >
      </div>

      <!-- BG Color -->
    </transition>

    <transition name="fade">
      <div
        class="bg-white rounded-lg top-0 absolute p-1"
        v-if="showBgColorPicker"
      >
        <SpecialButton
          @button-click="toggleColorPicker('showBgColorPicker')"
          class="bg-black text-white text-sm font-bold mt-2 p-3 rounded-lg w-full"
        >
          <font-awesome-icon :icon="['fas', 'close']" />
          Close Background Picker
        </SpecialButton>
        <Swatches v-model="bgColor" />
      </div>

      <!-- Wall Color -->
      <div
        class="bg-white rounded-lg top-0 absolute p-1"
        v-if="showWallColorPicker"
      >
        <SpecialButton
          @button-click="toggleColorPicker('showWallColorPicker')"
          class="bg-black text-white text-sm font-bold mt-2 p-3 rounded-lg w-full"
        >
          <font-awesome-icon :icon="['fas', 'close']" />
          Close Wall Picker
        </SpecialButton>
        <Swatches v-model="wallColor" />
      </div>

      <!-- Floor Color -->
      <div
        class="bg-white rounded-lg top-0 absolute p-1"
        v-if="showFloorColorPicker"
      >
        <SpecialButton
          @button-click="toggleColorPicker('showFloorColorPicker')"
          class="bg-black text-white text-sm font-bold mt-2 p-3 rounded-lg w-full"
        >
          <font-awesome-icon :icon="['fas', 'close']" />
          Close Floor Picker
        </SpecialButton>
        <Swatches v-model="floorColor" />
      </div>
    </transition>
  </div>
</template>

<script>
import Swatches from 'vue-color/src/components/Swatches';
import authService from '@/services/authService';
import EventBus from '@/eventBus.js';
import SpecialButton from './SpecialButton.vue';

export default {
  components: {
    Swatches,
    SpecialButton,
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
    toggleColorPicker(picker) {
      this[picker] = !this[picker];
    },

    // eslint-disable-next-line no-unused-vars
    handleWallColorChange(hexColor) {
      // Call the fromHex function or handle the color change here
      this.room.wallColor = hexColor;
      this.$store.commit('setRoomWallColor', hexColor);
      this.$store.commit('saveRoomToLocalStorage');
    },
    // eslint-disable-next-line no-unused-vars
    handleFloorColorChange(hexColor) {
      // Call the fromHex function or handle the color change here
      this.room.floorColor = hexColor;
      //Commit to store.js
      this.$store.commit('setRoomFloorColor', hexColor);
      this.$store.commit('saveRoomToLocalStorage');
    },
    handleBgColorChange(hexColor) {
      // Call the fromHex function or handle the color change here
      this.$store.commit('setRoomBgColor', hexColor);
      this.$store.commit('saveRoomToLocalStorage');
      EventBus.$emit('bg-color-change', hexColor);
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
      if (this.room.hideWalls) {
        if (this.room.hideFloor) {
          this.room.hideFloor = false;
        }
        this.room.y = 116;
        this.room.hideWalls = false;
        this.room.wallColor = this.$store.state.room.settings.wallColor;
        this.room.x = this.room.x - 8;
        this.$store.commit('setRoomWallDisplay', this.room.hideWalls);
        return;
      } else {
        this.room.y = 240;
        this.room.hideWalls = true;
        this.room.x = this.room.x + 8;
        this.$store.commit('setRoomWallDisplay', this.room.hideWalls);
        return;
      }

      // this.room.hideWalls = !this.room.hideWalls;

      //If wall is off, and floor is off, turn floor on
      // if (!this.room.hideWalls && this.room.hideFloor) {
      // this.toggleFloor();
      // this.room.wallColor = 'transparent';
      // return;
      // }

      // if (this.room.hideWalls) {
      //   this.room.y = 240;
      //   this.room.x = this.room.x + 8;
      // } else {
      //   this.room.y = 115;
      //   this.room.x = this.room.x - 8;
      // }
      // this.$store.commit('setRoomWallDisplay', this.room.hideWalls);
    },
    toggleFloor() {
      if (!this.room.hideWalls) {
        this.toggleWall();
      }

      this.room.hideFloor = !this.room.hideFloor;
      this.$store.commit('setRoomFloorDisplay', this.room.hideFloor);
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

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.vc-swatches {
  box-shadow: none !important;
  width: 100%;
  background-color: transparent;
  padding: 0 !important;
  height: auto;
  overflow: auto;
  margin-top: 5px;
}
.vc-swatches-box {
  margin: auto;
  padding: 0px 0px 0px 0px;
  margin: 0px;
}
.vc-swatches-color-group {
  margin: 0px;
  padding: 0px;
}

.vc-swatches-color-it {
  width: 38px;
  height: 38px;
  border-radius: 100px;
}
.vc-swatches-pick {
  margin-top: 7px;
  margin-left: 7px;
}
</style>
