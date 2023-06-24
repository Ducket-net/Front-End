<!-- src/components/GameRoom.vue -->
<template>
  <div ref="container" class="mx-auto max-w-md">
    <div
      ref="canvasContainer"
      id="canvasContainer"
      class="relative"
      @keydown="handleKeydown"
      tabindex="0"
    >
      <div class="mx-auto">
        <canvas ref="canvas" id="canvas" class="w-full min-h-[400px]"></canvas>
      </div>
    </div>

    <div v-if="withController == 'true'">
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

      <RoomSettings
        v-if="game && game.room"
        :gameRoom="game.room"
      ></RoomSettings>
    </div>

    <!-- roomSettingsOpen -->
  </div>
</template>

<script>
import VueBottomSheet from '@webzlodimir/vue-bottom-sheet';
import { FloorFurniture } from '@tetreum/shroom';
import Game from '@/game';
import { EventBus } from '@/eventBus'; // Import the EventBus
import RoomItemsList from '@/components/RoomItemList.vue'; // Import RoomItemsList
import GameController from '@/components/GameController.vue';
import RoomSettings from '@/components/RoomSettings.vue';

export default {
  name: 'GameRoom',
  components: {
    RoomItemsList,
    GameController,
    RoomSettings,
    VueBottomSheet,
  },
  props: ['roomId', 'withController'],
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
        direction: 2,
        animation: 1,
      },
    };
  },
  async mounted() {
    const { canvas } = this.$refs;
    const roomId = this.$route.params.id || this.roomId || 'blank';
    await this.$store.dispatch('selectRoomById', roomId);
    const { currentRoom } = this.$store.state;
    this.game = new Game(canvas, currentRoom);
    this.game.application.stage.addChild(this.game.room);
    this.$store.commit('setGame', this.game);
    this.game.setBackground(this.$store.state.room.settings.bgColor);
  },
  methods: {
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

    open() {
      this.$refs.myBottomSheet.open();
    },
    close() {
      this.$refs.myBottomSheet.close();
    },

    saveRoomToLocalStorage() {
      const roomData = this.game.getSerializedRoom();
      localStorage.setItem('savedRoom', JSON.stringify(roomData));
    },
    addItemByClassName(classname) {
      const newItem = new FloorFurniture({
        type: classname,
        roomX: 2,
        roomY: 2,
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
      EventBus.$emit('furni-added', newItem);
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
      this.saveRoomToLocalStorage();
    },
  },

  created() {
    // Listen for the 'item-selected' event and update selectedItemType

    EventBus.$on('item-selected', (item) => {
      this.selectedItem = item;
      this.selectedItemType = item.type;
      this.open();
    });

    // Listen for the 'item-unselected' event and clear selectedItemType
    EventBus.$on('item-unselected', () => {
      if (!this.selectedItem) return;
      this.unselectItem();
    });

    this.$root.$on('add-to-room', (classname) => {
      this.addItemByClassName(classname);
      this.saveRoomToLocalStorage();
    });

    EventBus.$on('select-item', (item) => {
      this.game.onFurnitureItemClick(item);
    });

    EventBus.$on('furni-added', () => {
      //   this.selectedItem = item;
      //   this.game.onFurnitureItemClick(item);
      //   this.saveRoomToLocalStorage();
    });

    EventBus.$on('update-item', () => {
      this.game.updateItem(this.selectedItem);
      this.saveRoomToLocalStorage();
    });

    EventBus.$on('item-settings', () => {
      this.roomSettingsOpen = !this.roomSettingsOpen;
    });

    EventBus.$on('bg-color-change', (color) => {
      this.game.setBackground(color);
    });
  },
};
</script>
<style scoped>
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
  background-image: url('../../public/6432-grid_2.png'),
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
