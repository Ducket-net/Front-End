<!-- src/components/GameRoom.vue -->
<template>
  <div ref="container" class="mx-auto">
    <div
      ref="canvasContainer"
      id="canvasContainer"
      class="relative"
      :style="{ backgroundColor: bgColor.hex }"
      @keydown="handleKeydown"
      tabindex="0"
    >
      <div class="mx-auto">
        <canvas ref="canvas" id="canvas" class="w-full min-h-[400px]"></canvas>
      </div>
    </div>

    <room-items-list
      v-if="game && game.room"
      :roomItems="Array.from(game.room.roomObjects)"
    ></room-items-list>

    <!-- src/components/GameRoom.vue -->

    <vue-bottom-sheet
      ref="myBottomSheet"
      :overlay="false"
      :click-to-close="true"
      :background-clickable="true"
    >
      <game-controller :game="game" ref="gameController"></game-controller>
    </vue-bottom-sheet>

    <!-- roomSettingsOpen -->
    <transition name="fade">
      <div
        v-if="roomSettingsOpen"
        class="max-w-md mx-auto pt-[42px] absolute top-0 left-0 right-0"
      >
        <!-- BG Color -->
        <div
          @click="showBgColorPicker = !showBgColorPicker"
          class="absolute left-0 top-[42px] bg-black text-white overflow-auto rounded-xl bg-opacity-70 text-xs px-5 py-3 hover:bg-gray-900 cursor-pointer rounded-tl-none rounded-bl-none"
        >
          <font-awesome-icon
            class="text-white overflow-auto rounded-lg"
            icon="cube"
          />
          Background
        </div>
        <div
          class="absolute right-4 left-4 bg-white overflow-auto rounded-lg z-10"
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
          class="absolute top-48 transform left-1/2 translate-x-24 -translate-y-0 bg-black text-white overflow-auto rounded-full bg-opacity-70 text-xs px-5 py-3 hover:bg-gray-900 cursor-pointer"
        >
          <font-awesome-icon
            class="text-white overflow-auto rounded-lg"
            icon="cube"
          />
          Wall
        </div>
        <div
          class="absolute right-4 left-4 bg-white overflow-auto rounded-lg z-10"
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
          class="absolute right-4 left-4 bg-white overflow-auto rounded-lg z-10"
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

        <button
          @click="roomSettingsOpen = false"
          class="absolute right-0 top-[42px] bg-black text-white overflow-auto rounded-xl bg-opacity-70 text-xs px-5 py-3 hover:bg-gray-900 cursor-pointer rounded-tr-none rounded-br-none"
        >
          <font-awesome-icon :icon="['fas', 'close']" /> Close Settings
        </button>

        <button
          @click="clearLocalStorage"
          class="absolute top-80 text-white overflow-auto bg-opacity-70 text-xs px-5 py-3 hover:bg-gray-900 cursor-pointer rounded-t-none rounded-br-none"
        >
          <font-awesome-icon :icon="['fas', 'trash']" /> Reset All
        </button>

        <button
          @click="toggleWall"
          class="absolute top-32 text-white overflow-auto l bg-opacity-70 text-xs px-5 py-3 hover:bg-gray-900 cursor-pointer rounded-t-none rounded-br-none"
        >
          Toggle Wall
        </button>

        <button
          @click="toggleFloor"
          class="absolute top-24 text-white overflow-auto bg-opacity-70 text-xs px-5 py-3 hover:bg-gray-900 cursor-pointer rounded-t-none rounded-br-none"
        >
          Toggle Floor (& Wall)
        </button>
      </div>
    </transition>
  </div>
</template>

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

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to {
  opacity: 1;
}

#canvasContainer {
  background-image: url("../../public/6432-grid_2.png"),
    linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.2));
}

@keyframes slide-up {
  0% {
    transform: translateY(100%);
  }
  75% {
    transform: translateY(-10%);
  }
  100% {
    transform: translateY(0%);
  }
}
</style>

<script>
import Game from "@/game";
import VueBottomSheet from "@webzlodimir/vue-bottom-sheet";
import { FloorFurniture } from "@tetreum/shroom";
import { EventBus } from "@/eventBus"; // Import the EventBus
import RoomItemsList from "@/components/RoomItemList.vue"; // Import RoomItemsList
import GameController from "@/components/GameController.vue";

import { Swatches } from "vue-color";

export default {
  name: "GameRoom",
  components: {
    RoomItemsList,
    GameController,
    Swatches,
    VueBottomSheet,
  },
  props: ["roomId"],
  data() {
    return {
      game: null,
      bgColor: {
        hex: "",
      },
      showBgColorPicker: false,
      wallColor: {
        hex: null,
      },
      showWallColorPicker: false,
      floorColor: {
        hex: null,
      },
      showFloorColorPicker: false,
      roomSettingsOpen: false,
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

    //Load Saved Wall Color
    if (localStorage.getItem("wallColor")) {
      this.game.room.wallColor = localStorage.getItem("wallColor");
    }

    //Load Saved Floor Color
    if (localStorage.getItem("floorColor")) {
      this.game.room.floorColor = localStorage.getItem("floorColor");
    }

    if (localStorage.getItem("bgColor")) {
      this.bgColor = {
        hex: localStorage.getItem("bgColor"),
      };
    }

    this.wallColor = {
      hex: this.game.room.wallColor,
    };

    this.floorColor = {
      hex: this.game.room.floorColor,
    };

    if (localStorage.getItem("hideWalls")) {
      this.game.room.hideWalls = localStorage.getItem("hideWalls") === "true";
      if (this.game.room.hideWalls) {
        this.game.room.y = 224;
        this.game.room.x = this.game.room.x + 8;
      }
    }

    if (localStorage.getItem("hideFloor")) {
      this.game.room.hideFloor = localStorage.getItem("hideFloor") === "true";
    }
  },
  methods: {
    toggleWall() {
      this.game.room.hideWalls = !this.game.room.hideWalls;

      if (this.game.room.hideWalls) {
        this.game.room.y = 224;
        this.game.room.x = this.game.room.x + 8;
      } else {
        this.game.room.y = 100;
        this.game.room.x = this.game.room.x - 8;
      }

      localStorage.setItem("hideWalls", this.game.room.hideWalls);
    },
    toggleFloor() {
      this.game.room.hideFloor = !this.game.room.hideFloor;
      localStorage.setItem("hideFloor", this.game.room.hideFloor);
    },
    clearLocalStorage() {
      //Confirm
      if (!confirm("Are you sure you want to reset all?")) return;
      localStorage.clear();
      location.reload();
    },
    open() {
      this.$refs.myBottomSheet.open();
    },
    close() {
      this.$refs.myBottomSheet.close();
    },
    // eslint-disable-next-line no-unused-vars
    handleWallColorChange(hexColor) {
      // Call the fromHex function or handle the color change here
      this.game.room.wallColor = hexColor;
      localStorage.setItem("wallColor", hexColor);
    },
    // eslint-disable-next-line no-unused-vars
    handleFloorColorChange(hexColor) {
      // Call the fromHex function or handle the color change here
      this.game.room.floorColor = hexColor;
      localStorage.setItem("floorColor", hexColor);
    },
    handleBgColorChange(hexColor) {
      // Call the fromHex function or handle the color change here
      this.game.room.bgColor = hexColor;
      localStorage.setItem("bgColor", hexColor);
    },
    saveRoomToLocalStorage() {
      const roomData = this.game.getSerializedRoom();
      localStorage.setItem("savedRoom", JSON.stringify(roomData));
    },
    addItemByClassName(classname) {
      const newItem = new FloorFurniture({
        type: classname,
        roomX: 1,
        roomY: 1,
        roomZ: 0,
        direction: 2,
        animation: 1,
      });
      this.game.addItem(newItem);
    },
    addItem() {
      const newItem = new FloorFurniture({ ...this.form });
      this.game.addItem(newItem);
      EventBus.$emit("furni-added", newItem);

      this.saveRoomToLocalStorage();

      // unselectFurniture
      // this.game.unselectFurniture();
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
      },
      deep: true,
    },
  },
  created() {
    // Listen for the 'item-selected' event and update selectedItemType
    EventBus.$on("item-selected", (item) => {
      this.selectedItem = item;
      this.selectedItemType = item.type;
      this.open();
      this.saveRoomToLocalStorage();
    });

    // Listen for the 'item-unselected' event and clear selectedItemType
    EventBus.$on("item-unselected", (item) => {
      console.log("item-unselected", item);
      this.close();
      this.selectedItem = null;
      this.selectedItemType = "";
    });

    this.$root.$on("add-to-room", (classname) => {
      console.log("add-to-room", classname);
      this.addItemByClassName(classname);
      this.saveRoomToLocalStorage();
    });

    EventBus.$on("select-item", (item) => {
      this.game.onFurnitureItemClick(item);
    });

    EventBus.$on("furni-added", (item) => {
      console.log("👋Added", item);
      //   this.selectedItem = item;
      //   this.game.onFurnitureItemClick(item);
      //   this.saveRoomToLocalStorage();
    });

    EventBus.$on("update-item", () => {
      this.game.updateItem(this.selectedItem);
      this.saveRoomToLocalStorage();
    });

    EventBus.$on("item-settings", () => {
      this.roomSettingsOpen = !this.roomSettingsOpen;
    });
  },
};
</script>
