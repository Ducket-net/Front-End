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
        <canvas ref="canvas" class="mx-auto"></canvas>
      </div>
    </div>

    <game-controller :game="game" ref="gameController"></game-controller>
    <room-items-list
      v-if="game && game.room"
      :roomItems="Array.from(game.room.roomObjects)"
    ></room-items-list>

    <!-- src/components/GameRoom.vue -->
  </div>
</template>

<script>
import Game from "@/game";
import { FloorFurniture } from "@tetreum/shroom";
import { EventBus } from "@/eventBus"; // Import the EventBus
import RoomItemsList from "@/components/RoomItemList.vue"; // Import RoomItemsList
import GameController from "@/components/GameController.vue";

export default {
  name: "GameRoom",
  components: {
    RoomItemsList,
    GameController,
  },
  props: ["roomId"],
  data() {
    return {
      game: null,
      bgColor: {
        hex: "#4D5562",
      },
      wallColor: {
        hex: null,
      },
      floorColor: {
        hex: null,
      },
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
  },
  methods: {
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
  },
};
</script>
