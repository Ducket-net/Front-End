<!-- src/components/GameRoom.vue -->
<template>
  <div
    ref="container"
    class="mx-auto max-w-md max-h-screen no-scrollbar overflow-y-scroll overflow-hidden"
  >
    <div
      ref="canvasContainer"
      id="canvasContainer"
      class="relative"
      tabindex="0"
    >
      <div class="mx-auto fade-in">
        <canvas
          ref="canvas"
          id="canvas"
          class="w-full"
          :style="{ height: canvasHeight + 'px' }"
        ></canvas>
      </div>
    </div>

    <div v-if="withController">
      <room-items-list
        v-if="game && game.room"
        :roomItems="Array.from(game.room.roomObjects)"
      ></room-items-list>

      <!-- src/components/GameRoom.vue -->

      <vue-bottom-sheet
        ref="myBottomSheet"
        :overlay="false"
        :click-to-close="false"
        :background-clickable="true"
        @closed="game.unselectFurniture(selectedItem)"
      >
        <game-controller :game="game" ref="gameController"></game-controller>
      </vue-bottom-sheet>
    </div>
    <div class="flex-1 overflow-y-auto h-auto">
      <RoomSettings
        v-if="game && game.room"
        :gameRoom="game.room"
      ></RoomSettings>
    </div>
    <!-- roomSettingsOpen -->
  </div>
</template>

<script>
import { VueBottomSheet } from '@webzlodimir/vue-bottom-sheet';
import { ref, onMounted } from 'vue';
import { FloorFurniture } from '@tetreum/shroom';
import Game from '@/game';
import { EventBus } from '@/eventBus'; // Import the EventBus
import RoomItemsList from '@/components/RoomItemList.vue'; // Import RoomItemsList
import GameController from '@/components/GameController.vue';
import RoomSettings from '@/components/RoomSettings.vue';

const myBottomSheet = ref(null);
// eslint-disable-next-line no-unused-vars
const open = () => {
  myBottomSheet.value.open();
};

// eslint-disable-next-line no-unused-vars
const close = () => {
  myBottomSheet.value.close();
};

export default {
  setup() {
    const myBottomSheet = ref(null);

    const open = () => {
      if (myBottomSheet.value) {
        myBottomSheet.value.open();
      }
    };

    onMounted(() => {
      EventBus.on('item-selected', (item) => {
        console.log('item-selected', item);
        // ...
        open();
      });

      // ... other EventBus listeners
    });

    return {
      myBottomSheet,
      // ... other returned properties and methods
    };
  },
  name: 'GameRoom',
  components: {
    RoomItemsList,
    GameController,
    RoomSettings,
    VueBottomSheet,
  },

  props: {
    roomId: {
      type: String,
      default: 'blank',
    },
    withController: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'default',
    },
    tilemap: {
      type: String,
      default: '',
      required: false,
    },
    smallRoom: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      game: null,
      roomSettingsOpen: false,
      selectedItemType: '',
      selectedItem: null,
      form: {
        type: '',
        roomX: 4,
        roomY: 4,
        roomZ: 0,
        direction: 0.1,
        animation: 1,
      },
    };
  },
  computed: {
    canvasHeight() {
      switch (this.size) {
        case 'xs':
          return 300;
        case 'small':
          return 380;
        case 'default':
          return 500;
        case 'lg':
          return 600;
        case 'xl':
          return 800;
        default:
          return 500;
      }
    },
  },
  async mounted() {
    const { canvas } = this.$refs;
    const roomId = this.$route.params.id || this.roomId || 'blank';
    // setRoomId
    this.$store.commit('setRoomId', roomId);
    await this.$store.dispatch('selectRoomById', roomId);
    const { currentRoom } = this.$store.state;
    this.game = new Game(
      canvas,
      currentRoom,
      this.withController,
      this.tilemap,
      this.smallRoom
    );
    this.game.application.stage.addChild(this.game.room);
    this.$store.commit('setGame', this.game);
    this.game.setBackground(this.$store.state.room.settings.bgColor);

    // Set the room position
    console.log(this.game.room.x, this.game.room.y);
    this.game.room.x = this.game.room.x + this.$store.state.room.settings.x;
    this.game.room.y = this.game.room.y + this.$store.state.room.settings.y;

    console.log(
      'this.$store.state.room.settings',
      this.$store.state.room.settings
    );

    if (this.$store.state.room.settings.hideWalls) {
      this.game.room.hideWalls = true;
    }
    if (this.$store.state.room.settings.hideFloors) {
      this.game.room.hideWalls = true;
      this.game.room.hideFloor = true;
    }
  },
  methods: {
    async downloadCanvas() {
      // Render the game room content one more time before downloading
      this.game.downloadRoomAsPNG();
    },

    moveRoom(dir) {
      switch (dir) {
        case 'up':
          this.game.room.y -= 10;
          break;
        case 'down':
          this.game.room.y += 10;
          break;
        case 'left':
          this.game.room.x -= 10;
          break;
        case 'right':
          this.game.room.x += 10;
          break;
      }
      localStorage.setItem('roomX', this.game.room.x);
      localStorage.setItem('roomY', this.game.room.y);
    },

    // open() {
    // this.$refs.myBottomSheet.open();
    // myBottomSheet.value.open();
    // },
    close() {
      // this.$refs.myBottomSheet.close();
    },
    addItemByClassName(classname) {
      let roomX = 2;
      let roomY = 2;

      if (this.smallRoom) {
        roomX = 1.75;
        roomY = 1.75;
      }

      const newItem = new FloorFurniture({
        type: classname,
        roomX: roomX,
        roomY: roomY,
        roomZ: 0,
        direction: 2,
        animation: 1,
      });
      this.game.addItem(newItem);
    },
    unselectItem() {
      this.selectedItem = null;
      this.selectedItemType = '';
    },
    addItem() {
      const newItem = new FloorFurniture({ ...this.form });
      this.game.addItem(newItem);
      EventBus.emit('furni-added', newItem);
    },

    handleKeydown(event) {
      if (!this.selectedItem) return;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          this.selectedItem.roomX -= 1;
          break;
        case 'ArrowRight':
          event.preventDefault();
          this.selectedItem.roomX += 1;
          break;
        case 'ArrowUp':
          event.preventDefault();
          this.selectedItem.roomY -= 1;
          break;
        case 'ArrowDown':
          event.preventDefault();
          this.selectedItem.roomY += 1;
          break;
        case ',':
          this.selectedItem.direction = (this.selectedItem.direction + 1) % 8;
          break;
      }
      this.$store.commit('saveRoomToLocalStorage');
    },
  },
  async created() {
    // Listen for the 'item-selected' event and update selectedItemType

    // EventBus.on('item-selected', (item) => {
    //   this.selectedItem = item;
    //   this.selectedItemType = item.type;
    //   this.open();
    // });

    // Listen for the 'item-unselected' event and clear selectedItemType
    EventBus.on('item-unselected', () => {
      if (!this.selectedItem) return;
      this.unselectItem();
      this.close();
    });

    EventBus.on('add-to-room', (classname) => {
      this.addItemByClassName(classname);
      this.$store.commit('saveRoomToLocalStorage');
    });

    EventBus.on('select-item', (item) => {
      this.game.onFurnitureItemClick(item);
    });

    EventBus.on('furni-added', () => {
      //   this.selectedItem = item;
      //   this.game.onFurnitureItemClick(item);
      //   this.$store.commit('saveRoomToLocalStorage');
    });

    EventBus.on('update-item', () => {
      this.game.updateItem(this.selectedItem);
      this.$store.commit('saveRoomToLocalStorage');
    });

    EventBus.on('item-settings', () => {
      this.roomSettingsOpen = !this.roomSettingsOpen;
    });

    EventBus.on('bg-color-change', (color) => {
      this.game.setBackground(color);
    });

    EventBus.on('download', () => {
      this.downloadCanvas();
    });
  },
};
</script>
<style scoped>
.fade-in {
  -webkit-animation: 1.9s ease 0s normal forwards 1 fadein;
  animation: 1.9s ease 0s normal forwards 1 fadein;
}

@keyframes fadein {
  0% {
    opacity: 0;
  }
  66% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@-webkit-keyframes fadein {
  0% {
    opacity: 0;
  }
  66% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
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
